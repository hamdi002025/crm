import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "b4ccb068-d61d-499c-86d1-9d239502df8d");
  requestHeaders.set("x-createxyz-project-group-id", "28330295-02ff-44e8-8c35-bc5ae4ce47af");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}