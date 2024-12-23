import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/professors">
          <Card>
            <CardHeader>
              <CardTitle>Professors</CardTitle>
            </CardHeader>
            <CardContent>Manage professor information</CardContent>
          </Card>
        </Link>
        <Link href="/departments">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
            </CardHeader>
            <CardContent>Manage department information</CardContent>
          </Card>
        </Link>
        <Link href="/modules">
          <Card>
            <CardHeader>
              <CardTitle>Modules</CardTitle>
            </CardHeader>
            <CardContent>Manage modules and their elements</CardContent>
          </Card>
        </Link>
        <Link href="/evaluation-methods">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Methods</CardTitle>
            </CardHeader>
            <CardContent>Manage evaluation methods</CardContent>
          </Card>
        </Link>
        <Link href="/assignments">
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>Manage element assignments to professors</CardContent>
          </Card>
        </Link>
        <Link href="/users">
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent>Manage user accounts and permissions</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

