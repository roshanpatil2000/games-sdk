import { Field, FieldLabel } from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group"

import { SearchIcon } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"


export function InputInputGroup() {
    return (
        // <Field>
        //     <InputGroup>
        //         <InputGroupInput id="input-group-url" placeholder="Search" />

        //         <InputGroupAddon align="inline-start">
        //             <Search />
        //         </InputGroupAddon>
        //     </InputGroup>
        // </Field>


        <Field>
            <ButtonGroup className="">
                <Input id="input-button-group" placeholder="Type to search game..." className="text-primary placeholder:text-primary/50 " />
                <Button variant="secondary" size="icon" ><SearchIcon /></Button>
            </ButtonGroup>

        </Field>
    )
}
