export const cleanSocketIpAddress = (address: String | undefined) => {
  const newAddress = address?.replace('::ffff:', '');
  return newAddress === '::1' ? 'localhost' : newAddress;
};
