# Hadrian Frontend Exercise

Joel Dodich, Jun 2024

#### Overview

Sample app to evaluate a demo part.

Built with **React + Vite + Typescript**. Styling provided by **Tailwind CSS** and shadcn/ui

To get started. install dependencies: `npm i`

To run the main app: `npm run dev`

To run Storybook: `npm run storybook`



#### Highlights

###### Dashboard & Analysis Pages

App consists of two pages, routed with react-router-dom. Analysis is a simple ThreeJS viewer that pulls from the sample datasets. Users can toggle colors, hover surfaces, and select pockets to see bounding boxes.

![Color Change](https://github.com/joeldodich/hadrian-exercise/assets/88948803/5f30c591-cab2-4f2e-a3a3-29c65d881221)



###### Storybook implementation for component UI testing

While Storybook may seem intimidating, there are some very powerful features that help me develop UI components quickly. This could also be piped to Chromatic for automated QC.

![Storybook](https://github.com/joeldodich/hadrian-exercise/assets/88948803/df2f87a4-bb0d-430b-887f-64404e97dcc5)



###### Mocked backend query with tanstack query & loading state

Although there was no API to hit, I mocked up a pattern for a call to a backend on a dashboard page, including loading state.

![Loader](https://github.com/joeldodich/hadrian-exercise/assets/88948803/6a61ece8-7df2-441d-a403-652d86ebf0fe)


###### Figma Mockups of Build

Leveraging Figma as a developer helps plan and identify architecture issues before getting deep into code. Link to the Figma file I generated is here: https://www.figma.com/design/NdGBBTJOWqLjcQUuqxFJ9S/Jdodich---Hadrian-Pocket-Review-Demo?node-id=167-9624&t=x9NDiTB79zTNGo0Q-1

![Section 3](https://github.com/joeldodich/hadrian-exercise/assets/88948803/fa93c1e6-21b7-4a45-a210-5437dfa87dce)


