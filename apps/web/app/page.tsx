import { Button } from "@repo/ui/button";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">RJ MLA Profile Dashboard</h1>
            <div className="flex gap-4">
                <Button>Get Started</Button>
                <Button variant="secondary">Learn More</Button>
            </div>
        </main>
    );
}
