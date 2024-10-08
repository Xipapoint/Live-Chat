import React from "react";

import RegisterWindow from "../../pages/RegisterWindow";
import chatWindow from "../../pages/ChatWindow";
import LoginWindow from "../../pages/LoginWindow";

export interface IRoute {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
}

export const publicRoutes: IRoute[] = [
    // {path: routeConstants.HOME_ROUTE, exact: true, component: HomePage},
    {path: '/register', exact: true, component: RegisterWindow},
    {path: 'login', exact: true, component: LoginWindow}
    // {path: `${routeConstants.GRAPH_ROUTE}` + routeConstants.DEJKSTRA_ROUTE, exact: true, component: DejkstraPage},
    // {path: `${routeConstants.TREE_ROUT}` + routeConstants.BINARYTREE_ROUT, exact: true, component: BinaryTreePage}
]

export const privateRoutes: IRoute[] = [
    {path: '/chat', exact: true, component: chatWindow},
]