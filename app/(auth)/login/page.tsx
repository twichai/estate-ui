import { LoginComponent } from "@/components/login";

export default function Login() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <LoginComponent
        logo={{
          url: "/",
          src: "",
          alt: "Estate",
          title: "Estate",
        }}
        signupUrl="/register"
      />
    </div>
  );
}
