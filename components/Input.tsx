"use client"

import { Field } from "@/components/ui/field"
import { SearchIcon } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function InputInputGroup() {
    const router = useRouter();
    const [value, setValue] = useState("");

    const submitSearch = () => {
        const query = value.trim();
        if (!query) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
        }
    };

    return (
        <Field>
            <ButtonGroup className="relative">
                <Input
                    id="input-button-group"
                    placeholder="Search games..."
                    className="text-foreground placeholder:text-muted-foreground"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Search"
                    onClick={submitSearch}
                >
                    <SearchIcon />
                </Button>
            </ButtonGroup>
        </Field>
    )
}
