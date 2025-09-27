import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // BASIC認証が有効でない場合はスキップする
  if (process.env.ENABLE_BASIC_AUTH !== "true") {
    if (path === "/") {
      return NextResponse.redirect(new URL("/auto-sales-email", req.url));
    }
    return NextResponse.next();
  }

  // 環境変数の設定がない場合はスキップする
  if (
    process.env.BASIC_AUTH_USERNAME === undefined ||
    process.env.BASIC_AUTH_PASSWORD === undefined
  ) {
    if (path === "/") {
      return NextResponse.redirect(new URL("/auto-sales-email", req.url));
    }
    return NextResponse.next();
  }

  // BASIC認証のチェック
  const basicAuth = req.headers.get("authorization");
  console.log("authorizationヘッダを確認😎", basicAuth);

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [username, password] = Buffer.from(authValue, "base64")
      .toString()
      .split(":");
    console.log("認証情報確認😲", authValue, username, password);

    if (
      username === process.env.BASIC_AUTH_USERNAME &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      if (path === "/") {
        return NextResponse.redirect(new URL("/auto-sales-email", req.url));
      }
      // BASIC認証に成功した場合、アクセスを許可する
      return NextResponse.next();
    }
  }

  // BASIC認証に失敗した場合、エラーを表示する
  console.log("認証失敗🙃");
  return NextResponse.json(
    { error: "Basic Auth Required" },
    {
      // eslint-disable-next-line quotes
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      status: 401,
    }
  );
}
