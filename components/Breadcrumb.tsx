'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";

type Props = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};
function Breadcrumb({
  homeElement,
  separator,
  activeClasses,
  containerClasses,
  listClasses,
  capitalizeLinks,
}: Props) {
  const paths = usePathname();
  const pathNames = paths?.split("/").filter((path) => path) ?? [];

  return (
    <ul className={containerClasses}>
      <li className={listClasses}>
        <Link href={"/"}>{homeElement}</Link>
      </li>
      {pathNames.length > 0 && separator}
      {pathNames.map((link, index) => {
        let href = `/${pathNames.slice(0, index + 1).join("/")}`;
        let itemClasses =
          paths === href ? `${listClasses} ${activeClasses}` : listClasses;
        let itemLink = capitalizeLinks
          ? link[0].toUpperCase() + link.slice(1, link.length)
          : link;
        return (
          <Fragment key={index}>
            <li className={itemClasses}>
              <Link href={href}>{itemLink}</Link>
            </li>
            {pathNames.length !== index + 1 && separator}
          </Fragment>
        );
      })}
    </ul>
  );
}

export default Breadcrumb;
