import React from "react";
import { FooterLinks } from "./footer.types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const footerLinksData: FooterLinks[] = [
  {
    id: 1,
    title: "Company",
    children: [
      { id: 11, label: "About Us", url: "#" },
      { id: 12, label: "Careers", url: "#" },
      { id: 13, label: "Blog", url: "#" },
      { id: 14, label: "Press", url: "#" },
    ],
  },
  {
    id: 2,
    title: "Help",
    children: [
      { id: 21, label: "Customer Support", url: "#" },
      { id: 22, label: "Delivery Details", url: "#" },
      { id: 23, label: "Track My Order", url: "#" },
      { id: 24, label: "Returns & Refunds", url: "#" },
    ],
  },
  {
    id: 3,
    title: "Gifts",
    children: [
      { id: 31, label: "Flowers", url: "/shop#flowers" },
      { id: 32, label: "Cakes", url: "/shop#cakes" },
      { id: 33, label: "Chocolates", url: "/shop#chocolates" },
      { id: 34, label: "Hampers", url: "/shop#hampers" },
    ],
  },
  {
    id: 4,
    title: "Occasions",
    children: [
      { id: 41, label: "Birthday", url: "/shop?occasion=birthday" },
      { id: 42, label: "Anniversary", url: "/shop?occasion=anniversary" },
      { id: 43, label: "Wedding", url: "/shop?occasion=wedding" },
      { id: 44, label: "Diwali", url: "/shop?occasion=diwali" },
    ],
  },
];

const LinksSection = () => {
  return (
    <>
      {footerLinksData.map((item) => (
        <section className="flex flex-col mt-5" key={item.id}>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-widest mb-6">
            {item.title}
          </h3>
          {item.children.map((link) => (
            <Link
              href={link.url}
              key={link.id}
              className={cn([
                "text-black/60 text-sm md:text-base mb-4 w-fit hover:text-black transition-colors",
              ])}
            >
              {link.label}
            </Link>
          ))}
        </section>
      ))}
    </>
  );
};

export default LinksSection;
