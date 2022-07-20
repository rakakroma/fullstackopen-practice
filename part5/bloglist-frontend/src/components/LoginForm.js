const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => {
  return <form onSubmit={handleLogin}>
    <label htmlFor="username">username</label>
    <input type="text" value={username} name="username" id="username" onChange={e => setUsername(e.target.value)} />
    <br />
    <label htmlFor="password">password</label>
    <input type="password" value={password} name="password" id="password" onChange={e => setPassword(e.target.value)} />
    <br />
    <button type="submit" id="login-button">login</button>
  </form>
}

export default LoginForm