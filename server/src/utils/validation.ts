export const isJwt = (value: string) =>
  !!value.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/);

export const isEmail = (value: string) =>
  !!value.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i);
