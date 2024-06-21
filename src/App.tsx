import { Model } from "@/components/model/model";
import { useState } from "react";
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
        <div className="max-w-full max-h-full h-full w-full">
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
        </div>
    );
}

export default App;
