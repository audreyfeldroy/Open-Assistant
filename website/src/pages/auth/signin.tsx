import { Button, Input, Stack } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import React, { useRef } from "react";
import { FaBug, FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa";
import { AuthLayout } from "src/components/AuthLayout";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Signin({ csrfToken, providers }) {
  const { discord, email, github, credentials } = providers;
  const emailEl = useRef(null);
  const signinWithEmail = (ev: React.FormEvent) => {
    ev.preventDefault();
    signIn(email.id, { callbackUrl: "/", email: emailEl.current.value });
  };

  const debugUsernameEl = useRef(null);
  function signinWithDebugCredentials(ev: React.FormEvent) {
    ev.preventDefault();
    signIn(credentials.id, { callbackUrl: "/", username: debugUsernameEl.current.value });
  }

  const { colorMode } = useColorMode();
  const bgColorClass = colorMode === "light" ? "bg-gray-50" : "bg-chakra-gray-900";
  const buttonBgColor = colorMode === "light" ? "#2563eb" : "#2563eb";

  const buttonColorScheme = colorMode === "light" ? "blue" : "dark-blue-btn";

  return (
    <div className={bgColorClass}>
      <Head>
        <title>Sign Up - Open Assistant</title>
        <meta name="Sign Up" content="Sign up to access Open Assistant" />
      </Head>
      <AuthLayout>
        <Stack spacing="2">
          {credentials && (
            <form onSubmit={signinWithDebugCredentials} className="border-2 border-orange-600 rounded-md p-4 relative">
              <span className={`text-orange-600 absolute -top-3 left-5 ${bgColorClass} px-1`}>For Debugging Only</span>
              <Stack>
                <Input variant="outline" size="lg" placeholder="Username" ref={debugUsernameEl} />
                <Button size={"lg"} leftIcon={<FaBug />} colorScheme={buttonColorScheme} color="white" type="submit">
                  Continue with Debug User
                </Button>
              </Stack>
            </form>
          )}
          {email && (
            <form onSubmit={signinWithEmail}>
              <Stack>
                <Input variant="outline" size="lg" placeholder="Email Address" ref={emailEl} />
                <Button
                  size={"lg"}
                  leftIcon={<FaEnvelope />}
                  type="submit"
                  colorScheme={buttonColorScheme}
                  color="white"
                >
                  Continue with Email
                </Button>
              </Stack>
            </form>
          )}
          {discord && (
            <Button
              bg={buttonBgColor}
              _hover={{ bg: "#4A57E3" }}
              _active={{
                bg: "#454FBF",
              }}
              size="lg"
              leftIcon={<FaDiscord />}
              color="white"
              onClick={() => signIn(discord.id, { callbackUrl: "/" })}
              // isDisabled="false"
            >
              Continue with Discord
            </Button>
          )}
          {github && (
            <Button
              bg="#333333"
              _hover={{ bg: "#181818" }}
              _active={{
                bg: "#101010",
              }}
              size={"lg"}
              leftIcon={<FaGithub />}
              colorScheme="blue"
              // isDisabled="false"
            >
              Continue with Github
            </Button>
          )}
        </Stack>
        <div className="pt-10 text-center">
          By signing up you agree to our <br></br>
          <Link href="/terms-of-service" aria-label="Terms of Service" className="hover:underline underline-offset-4">
            <b>Terms of Service</b>
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" aria-label="Privacy Policy" className="hover:underline underline-offset-4">
            <b>Privacy Policy</b>
          </Link>
          .
        </div>
      </AuthLayout>
    </div>
  );
}

Signin.getLayout = (page) => (
  <div className="grid grid-rows-[min-content_1fr_min-content] h-full justify-items-stretch">
    <Header transparent={true} />
    {page}
    <Footer />
  </div>
);

export default Signin;

export async function getServerSideProps() {
  const csrfToken = await getCsrfToken();
  const providers = await getProviders();
  return {
    props: {
      csrfToken,
      providers,
    },
  };
}
