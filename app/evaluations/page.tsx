import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HomeEvaliation() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Grade Space </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </div>
  );
}
