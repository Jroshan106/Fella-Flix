export function LogoutButton() {
  return <form action="/api/auth/logout" method="post"><button className="text-sm font-semibold text-primary whitespace-nowrap hover:underline">Sign out</button></form>;
}
