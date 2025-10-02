"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { login } from "./actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function Page() {
  const [state, loginAction, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("Login successful!");
      redirect("/");
    } else if (state?.errors) {
      toast.error("Login failed. Please check your credentials.");
    }
  }, [state]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={loginAction}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value="m@example.com"
                      required
                    />
                    {state?.errors?.email && (
                      <p className="text-sm text-red-500">
                        {state.errors.email.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value="12345678"
                      required
                    />
                    {state?.errors?.password && (
                      <p className="text-sm text-red-500">
                        {state.errors.password.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="cursor-pointer w-full"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
