/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignupImport } from './routes/signup'
import { Route as IndexImport } from './routes/index'
import { Route as SigninIndexImport } from './routes/signin/index'

// Create/Update Routes

const SignupRoute = SignupImport.update({
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SigninIndexRoute = SigninIndexImport.update({
  path: '/signin/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupImport
      parentRoute: typeof rootRoute
    }
    '/signin/': {
      id: '/signin/'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof SigninIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/signup': typeof SignupRoute
  '/signin': typeof SigninIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/signup': typeof SignupRoute
  '/signin': typeof SigninIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/signup': typeof SignupRoute
  '/signin/': typeof SigninIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/signup' | '/signin'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/signup' | '/signin'
  id: '__root__' | '/' | '/signup' | '/signin/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SignupRoute: typeof SignupRoute
  SigninIndexRoute: typeof SigninIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SignupRoute: SignupRoute,
  SigninIndexRoute: SigninIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/signup",
        "/signin/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/signup": {
      "filePath": "signup.tsx"
    },
    "/signin/": {
      "filePath": "signin/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
