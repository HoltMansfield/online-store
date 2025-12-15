import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <Card className="max-w-4xl w-full">
        <CardHeader className="pb-2">
          <CardTitle>Welcome, human!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 pt-0">
          <p>
            Your content here
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
