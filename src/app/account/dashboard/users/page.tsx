"use client";

import GradientText from "@/components/GradientText";
import LooperBackground from "@/components/LooperBackground";
import MainWrapper from "@/components/MainWrapper";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import CrossIcon from "@/components/icons/Cross";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils/cn";
import { hasPermissions } from "@/lib/utils/permissions";
import { Permission } from "@/types";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  User as UserHeader,
  Link,
} from "@nextui-org/react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * The account dashboard page
 *
 * @returns The JSX element
 */
export default function DashboardPage() {
  return (
    <>
      <LooperBackground className="fixed -right-[50rem] bottom-0 z-0 h-[42rem] w-[80rem] scale-[1.75] sm:-right-96 xl:w-screen" />
      <Navbar />

      <Providers>
        <Components />
      </Providers>
    </>
  );
}

/**
 * The main components of the home page
 *
 * @returns The JSX element
 */
function Components(): JSX.Element {
  const { data: session, status: sessionStatus } = useSession();
  const { mutateAsync: getAllUsers, status: getAllUsersStatus } =
    trpc.getAllUsers.useMutation();
  const { mutateAsync: updateUser, status: updateUserStatus } =
    trpc.updateUser.useMutation();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (getAllUsersStatus === "loading" || getAllUsersStatus === "success") {
      return;
    }

    if (!session || sessionStatus !== "authenticated") {
      return;
    }

    getAllUsers().then((res) => {
      if (!res.success) {
        return;
      }

      setUsers(res.users as User[]);
    });
  }, [session, sessionStatus]);

  if (sessionStatus === "loading" || getAllUsersStatus === "loading") {
    return (
      <Spinner
        color="secondary"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    );
  }

  if (sessionStatus === "unauthenticated" || !session) {
    return (
      <MainWrapper className="relative z-10 w-full justify-start gap-2 px-12 py-40 text-center">
        <h1 className="text-7xl font-extrabold tracking-wide text-foreground">
          Invalid session
        </h1>
        <p className="my-4 text-gray-400">
          You need to be signed in to access this page.
        </p>
        <Button href="/auth/signin" as={Link}>
          Sign in
        </Button>
      </MainWrapper>
    );
  }

  if (!hasPermissions(session.user.permissions, [Permission.ADMIN])) {
    return (
      <MainWrapper className="relative z-10 w-full justify-start gap-2 px-12 py-40 text-center">
        <h1 className="text-7xl font-extrabold tracking-wide text-foreground">
          Unauthorized
        </h1>
        <p className="my-4 text-gray-400">
          You do not have permission to access this page. (need: admin)
        </p>
        <Button href="/auth/signin" as={Link}>
          Switch accounts
        </Button>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper className="relative items-start justify-start gap-7 px-7 py-16 sm:p-16">
      <div className="z-10 flex w-fit flex-col gap-4 text-foreground">
        <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">
          Manage <GradientText className="font-bold">Members</GradientText>
        </h1>
        <p className="w-3/5 text-sm text-gray-200/70">
          Manage registered users. You can search for an user below to quickly
          modify their details. Or <Link href="/account">go back</Link> to your
          account.
        </p>
        <Input
          label="Search"
          size="md"
          className="w-96 text-foreground"
          placeholder="Search for an user"
          variant="bordered"
          value={search}
          classNames={{
            inputWrapper: "border-gray-300/10",
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/**
       * An array of user cards
       */}
      <div className="flex w-full flex-wrap gap-7">
        {users.map((user) => {
          if (
            !user.name.toLowerCase().includes(search.toLowerCase()) &&
            !user.email.toLowerCase().includes(search.toLowerCase())
          ) {
            return null;
          }

          const addPermission = async (permission: Permission) => {
            const res = await updateUser({
              auth: session.user.secret,
              id: user.id,
              user: {
                permissions: user.permissions
                  .filter((p) => p !== permission) // remove the permission (if already exists)
                  .concat(permission), // add the permission
              },
            });

            if (!res.success || !res.user) {
              return;
            }

            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? res.user : u)),
            );
          };

          const removePermission = async (permission: Permission) => {
            const res = await updateUser({
              auth: session.user.secret,
              id: user.id,
              user: {
                permissions: user.permissions.filter((p) => p !== permission),
              },
            });

            if (!res.success || !res.user) {
              return;
            }

            setUsers((prev) =>
              prev.map((u) => (u.id === user.id ? res.user : u)),
            );
          };

          return (
            <div
              key={user.id}
              className="z-10 flex w-fit max-w-96 flex-col items-start justify-start gap-4 rounded-md border-2 border-gray-300/10 bg-background/90 p-7 text-foreground"
            >
              <UserHeader
                avatarProps={{
                  src: user.image,
                }}
                name={user.name}
                description={
                  <Link href={`mailto:${user.email}`} size="sm">
                    {user.email}
                  </Link>
                }
              />
              <div className="flex w-full flex-wrap items-center justify-start gap-2">
                {user.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex w-fit flex-row items-center justify-start gap-2 rounded-md border border-gray-300/10 p-2"
                  >
                    <CrossIcon
                      className={cn(
                        "cursor-pointer rounded-full bg-gray-300/10 p-1 duration-300 ease-in-out hover:bg-gray-300/30 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                        (user.id === session.user.id &&
                          permission === Permission.ADMIN) ||
                          permission === Permission.DEFAULT
                          ? "hidden"
                          : "",
                      )}
                      aria-disabled={updateUserStatus === "loading"}
                      onClick={() =>
                        updateUserStatus === "loading"
                          ? null
                          : removePermission(permission)
                      }
                    />
                    <p className="text-xs text-gray-200/70">{permission}</p>
                  </div>
                ))}
              </div>
              <Dropdown
                placement="bottom-end"
                className="border-2 border-gray-300/10 bg-background text-foreground"
              >
                <DropdownTrigger>
                  <Button variant="bordered" color="secondary" size="sm">
                    Add Permissions
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Modify user permissions"
                  disabledKeys={user.permissions}
                >
                  <DropdownItem key="default">Member</DropdownItem>
                  <DropdownItem
                    key="admin"
                    onClick={() => addPermission(Permission.ADMIN)}
                  >
                    Admin
                  </DropdownItem>
                  <DropdownItem
                    key="edit_event"
                    onClick={() => addPermission(Permission.EDIT_EVENT)}
                  >
                    Edit Events
                  </DropdownItem>
                  <DropdownItem
                    key="delete_event"
                    onClick={() => addPermission(Permission.DELETE_EVENT)}
                  >
                    Delete Events
                  </DropdownItem>
                  <DropdownItem
                    key="CREATE_EVENT"
                    onClick={() => addPermission(Permission.CREATE_EVENT)}
                  >
                    Post Events
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        })}
      </div>
    </MainWrapper>
  );
}
