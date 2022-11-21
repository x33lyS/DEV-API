export const mapToDto = item => ({
  id: item.id,
  username: item.login,
  password: item.pwd,
  role: item.role,
});
