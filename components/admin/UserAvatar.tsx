import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Props = {
  session: any;
};

function UserAvatar({ session }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <img
          className="h-10 w-10 cursor-pointer rounded-full border-2 border-zinc-400"
          src={session.user?.image || "/icons/android-icon-72x72.png"}
          alt="Rounded avatar"
          aria-label="Profile options"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[140px] rounded-md border border-zinc-600/50 bg-zinc-900 pb-2 text-zinc-300 shadow-lg will-change-[opacity,transform] data-[side=right]:animate-slideLeftAndFade"
          sideOffset={5}
          side="right"
          align="end"
        >
          <div className="flex flex-col px-5 pb-1 pt-4">
            <p className="text-sm font-medium text-zinc-300">
              {session.user?.globalName}{" "}
              <span className="text-xs">({session.user?.name})</span>
            </p>
            <p className="text-sm font-medium text-zinc-400">
              {session.user?.email}
            </p>
          </div>
          <DropdownMenu.Item
            disabled={true}
            className="group relative flex select-none items-center px-5 py-2 text-sm leading-none text-zinc-500 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-800/50 data-[highlighted]:text-zinc-300"
          >
            Profile (Soon)
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="mx-4 my-1 h-[1px] bg-zinc-800" />

          <DropdownMenu.Item
            onClick={() => console.log("Log out")}
            className="group relative flex cursor-pointer select-none items-center px-5 py-2 text-sm leading-none text-zinc-500 outline-none data-[highlighted]:bg-zinc-800/50 data-[highlighted]:text-zinc-300"
          >
            Log Out
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-zinc-600 opacity-60" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default UserAvatar;
