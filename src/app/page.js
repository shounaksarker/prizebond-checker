import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { ArrowRight, Ticket, Search, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prize Bond Result Matching System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easily manage your prize bonds and check if you&apos;ve won! Add your bonds
            individually or in bulk, and match them against the latest draw results.
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Add Your Bonds</h3>
              <p className="text-gray-600">
                Enter your prize bond numbers individually or upload them in bulk using
                our easy-to-use interface.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">2. Check Results</h3>
              <p className="text-gray-600">
                Select a draw from our comprehensive list and instantly check if any
                of your bonds have won.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">3. Stay Updated</h3>
              <p className="text-gray-600">
                Keep track of all your prize bonds and get notified when new draw
                results are available.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Add Prize Bonds
              </CardTitle>
              <CardDescription>
                Add your prize bonds individually or upload them in bulk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full">
                  Manage Bonds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Match Results
              </CardTitle>
              <CardDescription>
                Check your bonds against the latest draw results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/results">
                <Button className="w-full" variant="secondary">
                  Check Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full" variant="outline">
                  View Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
