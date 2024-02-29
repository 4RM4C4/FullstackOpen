const Login = ({ username, password, setUsername, setPassword, handleLogin, user }) => {
  if (user === null) {
    return (<>
      <form onSubmit={handleLogin}>
        <div>
      Username
          <input
            type="text"
            autoComplete="username"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
      Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <br></br>
    </>)
  }
  return <></>
}
export default Login