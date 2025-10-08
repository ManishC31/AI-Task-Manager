"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, FolderKanban, Users, User2, User2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/employees", label: "Employees", icon: Users },
  ];

  const { setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-0">
          {/* App name */}
          <Link href="/" className="text-lg font-semibold">
            MyApp
          </Link>

          {/* Center tabs (desktop only) */}
          <div className="hidden md:flex">
            <Tabs defaultValue={pathname.startsWith("/employees") ? "employees" : "projects"}>
              <TabsList>
                {navItems.map((item) => (
                  <TabsTrigger key={item.href} value={item.label.toLowerCase()} asChild>
                    <Link
                      href={item.href}
                      className={cn("px-4 py-2 transition-colors", pathname.startsWith(item.href) && "font-medium")}
                    >
                      {item.label}
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Avatar dropdown (desktop) */}
          <div className="hidden md:flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                  <AvatarFallback>
                    <User2Icon className="h-15 w-15" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-red-500">
                  <button
                    onClick={async () => {
                      await signOut();
                    }}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b px-4 py-3">
                  <SheetTitle className="text-base">MyApp</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col p-4 gap-4">
                  <nav className="flex flex-col gap-2">
                    {navItems.map(({ href, label, icon: Icon }) => (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                            pathname.startsWith(href) && "bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </SheetClose>
                    <button
                      onClick={async () => {
                        setOpen(false);
                        await signOut();
                      }}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 container mx-auto py-6 px-4 md:px-0">{children}</main>
    </div>
  );
}
