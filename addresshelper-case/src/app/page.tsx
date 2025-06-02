import AddressValidator from "@/components/AddressValidator";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <main className="w-full container">
        <AddressValidator />
      </main>
    </div>
  );
}
