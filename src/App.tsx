import { Model } from "@/components/model/model";
import { useState } from "react";
import "./App.css";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";

export enum Colorization {
    NONE = "none",
    ENTITY = "entity",
    POCKET = "pocket",
}

function App() {
    const [colorization, setColorization] = useState<Colorization>(
        Colorization.NONE
    );

    return (
        <>
            <ToggleGroup
                type="single"
                value={colorization}
                onValueChange={(data: Colorization) => setColorization(data)}
            >
                <ToggleGroupItem value={Colorization.NONE}>
                    None
                </ToggleGroupItem>
                <ToggleGroupItem value={Colorization.ENTITY}>
                    Entity
                </ToggleGroupItem>
                <ToggleGroupItem value={Colorization.POCKET}>
                    Pocket
                </ToggleGroupItem>
            </ToggleGroup>
            <Model colorization={colorization} />
        </>
    );
}

export default App;
