import { InputInputGroup } from "./Input";
import { ToggleTheme } from "./ToggleTheme";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center gap-3 px-2 py-3 lg:px-10 bg-secondary/50 sticky top-0 z-50 backdrop-blur supports-backdrop-filter:bg-secondary/80">
            {/* Logo */}
            <h1 className="text-2xl font-bold uppercase">Game<span className="text-primary">Pix</span></h1>
            {/* search */}
            <div className=" flex gap-2 border md:gap-3 lg:gap-10 ">
                <InputInputGroup />
                <ToggleTheme />

            </div>
        </div>
    )

}