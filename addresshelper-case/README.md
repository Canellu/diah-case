## DI Address Helper Case

### Approach

- Read through the case thoroughly, understand the requirements, and identify the key components.
- Check the `DI Address Helper V2` documentation and test the endpoints to ensure they are working as expected and also to understand the response structure.
- Bootstrap the project using `create-next-app`. NextJS is a React framework that provides a lot of features out of the box.
- Use shadcn ui for the UI components. Shadcn ui is a collection of UI components that are built using tailwind css.
- Once project structure is ready, start building the application. Started with the endpoints and types.
- Afterwards moved on to UI for getting user input and displaying the results.
- Added a map for fun and better visual experience.
- Finally added a simple E2E test that checks if the basic functionality of the application is working as expected.

### Things to improve / TODOs

- Improve UI for showing information
- Mobile friendly UI
- Error handling
- Better test coverage
- More features like:
  - Using user current location
  - Adding filters
- Better accessibility (improve keyboard navigation etc.)
- Better performance
  - Efficient caching (Tanstack Query)

### Setting up the Project

Install the dependencies:

```bash
npm install
```

### Build and run the Application

```bash
npm run build
```

After build completes run:

```bash
npm run start
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the E2E Test

The application server needs to be running in order to run the E2E test.

```bash
npm run test
```
