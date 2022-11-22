export const mapToDto = item => ({
  id: item.id,
  username: item.email,
  password: item.password,
  role: item.role,
});
