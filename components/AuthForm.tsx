"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";

interface Props<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP" | "SIGN_OUT";
  schema: ZodType<T>;
  defaultValues?: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
}: Props<T>) => {
  const isSignIn = type === "SIGN_IN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = (data: T) => {
    console.log(data);
  };

  return (
    <div className={"flex flex-col w-full gap-4 font-lato"}>
      <h1 className={"text-2xl font-semibold text-white"}>
        {isSignIn ? "Welcome back to Strimz" : "Create your account "}
      </h1>
      <p className={"text-light-100 font-nunito-sans"}>
        {isSignIn
          ? "Get access to blockbuster movies and stay updated."
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          {Object.keys(defaultValues ?? {}).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }: { field: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => (
                <FormItem>
                  <FormLabel className={"capitalize font-sm font-poppins"}>
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                      className={
                        "form-input placeholder:text-gray-800 placeholder:text-sm"
                      }
                      placeholder={
                        field.name === "password"
                          ? "Atleast 8 character long"
                          : ""
                      }
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" className={"form-btn font-medium"}>
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className={"text-center text-sm font-poppins font-medium"}>
        {isSignIn ? "New to Strimz? " : "Already have an account? "}

        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className={"text-green-500 font-bold"}
        >
          {isSignIn ? "Create an account. " : "Sign In"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;
