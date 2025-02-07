import Link from "next/link";

interface NavbarItemProps {
  item: {
    label: string;
    href: string;
    name: string;
  };
}

export default function NavbarItem({ item }: NavbarItemProps) {
  return (
    <Link
      href={item.href}
      className="block border border-transparent px-3 py-4 text-base font-semibold transition-all duration-300 ease-in-out hover:text-calibre-citrus hover:bg-slate-900/60 md:hover:bg-transparent lg:py-2"
    >
      {item.name}
    </Link>
  );
}
