export type Todo = {
  id: string;
  title: string;
};

export enum Path {
  Home = '/',
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}