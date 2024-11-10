"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
} from "@nextui-org/react";
import Image from "next/image";

export default function Header() {
  return (
    <Navbar
      classNames={{
        base: "lg:bg-transparent lg:backdrop-filter-none",
        item: "data-[active=true]:text-primary",
        wrapper: "px-4 sm:px-6 justify-between",
      }}
      height="60px"
      maxWidth="full"
    >
      <NavbarBrand>
        <Link href="/">
          <Image
            src="/images/logo.svg"
            width={40}
            height={25}
            className="w-44"
            priority
            alt="Logo"
          />
        </Link>
      </NavbarBrand>

      <NavbarContent
        className="ml-auto flex h-12 max-w-fit items-center gap-0 rounded-full p-0 lg:px-1"
        justify="end"
      >
        <NavbarItem className="px-2">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="mt-1 h-8 w-8 outline-none transition-transform">
                <Badge
                  className="border-transparent"
                  color="success"
                  content=""
                  placement="bottom-right"
                  shape="circle"
                  size="sm"
                >
                  <Avatar
                    size="sm"
                    src="https://img.freepik.com/free-photo/smiley-handsome-man-posing_23-2148911841.jpg"
                  />
                </Badge>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">dev@fieldtech.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
