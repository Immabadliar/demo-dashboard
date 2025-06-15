import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const usersData = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'suspended' },
  { id: 3, name: 'Charlie Rose', email: 'charlie@example.com', role: 'Editor', status: 'active' },
  { id: 4, name: 'Dana White', email: 'dana@example.com', role: 'User', status: 'active' },
];

const reportsData = [
  {
    id: 1,
    title: 'Harassment Report',
    reportedUser: 'Alice Smith',
    reason: 'Verbally harassing another user during a group chat session.'
  },
  {
    id: 2,
    title: 'Spam Report',
    reportedUser: 'Bob Johnson',
    reason: 'Sending unsolicited links and repetitive messages.'
  },
  {
    id: 3,
    title: 'Inappropriate Content',
    reportedUser: 'Charlie Rose',
    reason: 'Sharing inappropriate images in public chat.'
  }
];

function Sidebar({ currentPage, setPage, sidebarOpen, setSidebarOpen }) {
  const handleClick = (item) => {
    setPage(item);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      {['Users', 'Reports', 'Settings'].map((item) => (
        <button
          key={item}
          className={currentPage === item ? 'active' : ''}
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}

function TopBar({ theme, toggleTheme, adminName, onSettingsClick, onLogout, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <div className="logo">Admin Dashboard</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        <button className="toggle-theme" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div
          className="user-label"
          onClick={() => setDropdownOpen((open) => !open)}
          ref={dropdownRef}
          tabIndex={0}
          role="button"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          {adminName || 'admin'}
          <span className="caret">▾</span>
          {dropdownOpen && (
            <div className="user-dropdown">
              <button onClick={() => { setDropdownOpen(false); onSettingsClick(); }}>
                Settings
              </button>
              <button onClick={() => { setDropdownOpen(false); onLogout(); }}>
                Log Out
              </button>
              <button>
                Inbox
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function UsersView() {
  const [users, setUsers] = useState(usersData);
  const [query, setQuery] = useState('');

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="main">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={{ textTransform: 'capitalize' }}>{user.status}</td>
                <td>
                  <button onClick={() => toggleStatus(user.id)} className="action-btn">
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="main">
      <h2>Reports</h2>
      {reportsData.map((report) => (
        <div className="report" key={report.id}>
          <h3>{report.title}</h3>
          <p><strong>Reported User:</strong> {report.reportedUser}</p>
          <p><strong>Reason:</strong> {report.reason}</p>
        </div>
      ))}
    </div>
  );
}

function SettingsView({ theme, toggleTheme, adminName, setAdminName }) {
  const handleNameChange = (e) => {
    setAdminName(e.target.value);
  };

  return (
    <div className="main settings-page">
      <h2>Settings</h2>
      <div className="settings-item">
        <label>Theme:</label>
        <button onClick={toggleTheme} className="toggle-theme">
          {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </button>
      </div>

      <div className="settings-item">
        <label>Admin Display Name:</label>
        <input
          type="text"
          value={adminName}
          onChange={handleNameChange}
          placeholder="Enter display name"
        />
      </div>
    </div>
  );
}

function LoggedOut() {
  return (
    <div className="logged-out-screen">
      <h2>You have been logged out.</h2>
      <p>Please refresh the page to log back in.</p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('Users');
  const [theme, setTheme] = useState('light');
  const [adminName, setAdminName] = useState('admin');
  const [loggedIn, setLoggedIn] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const goToSettings = () => {
    setPage('Settings');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  if (!loggedIn) {
    return <LoggedOut />;
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={page} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-content">
        <TopBar
          theme={theme}
          toggleTheme={toggleTheme}
          adminName={adminName}
          onSettingsClick={goToSettings}
          onLogout={handleLogout}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="page-content">
          {page === 'Users' && <UsersView />}
          {page === 'Reports' && <ReportsView />}
          {page === 'Settings' && (
            <SettingsView
              theme={theme}
              toggleTheme={toggleTheme}
              adminName={adminName}
              setAdminName={setAdminName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
