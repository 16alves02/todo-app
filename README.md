# Todo App

A browser-based task manager built with HTML, CSS and vanilla JavaScript. This project focuses on the fundamentals of an interactive web application without a frontend framework or build tools.

**[Open the live demo](https://todo-app-three-beta-56.vercel.app)**

![Todo App screenshot](assets/screenshot.png)

## Features

- Add tasks using the button or the Enter key.
- Mark tasks as completed or active again.
- Filter tasks by all, active or completed.
- Delete individual tasks or clear all completed tasks.
- Save tasks in the browser using `localStorage`.
- Display the current date and the number of pending tasks.
- Support keyboard navigation and provide accessible labels for controls.
- Adapt the layout to smaller screens.

## Built with

| Technology | Purpose |
| --- | --- |
| HTML | Page structure and semantic elements |
| CSS | Layout, styling, responsive behaviour and focus states |
| JavaScript | Events, arrays, DOM updates and application state |
| `localStorage` | Saving tasks between visits in the same browser |
| Font Awesome | Interface icons |

## How it works

Tasks are stored in a JavaScript array. When the task list changes, the app saves the updated array to `localStorage` and renders the visible, filtered list.

```text
User action
    |
    v
Update the task array
    |
    +----> Save to localStorage
    |
    v
Render the filtered list
```

Saved tasks belong to the browser and device where they were created. The app has no backend, user accounts or cross-device synchronisation.

## Run locally

No installation or build step is required.

```bash
git clone https://github.com/16alves02/todo-app.git
cd todo-app
```

Open `index.html` in a modern browser.

## Manual testing checklist

There is no automated test suite yet. Use this checklist to check the main behaviours after making changes:

- Add a task using the plus button.
- Add a task by pressing Enter.
- Try adding a blank task or one containing only spaces.
- Mark a task as completed, then mark it active again.
- Confirm that the All, Active and Completed filters show the expected tasks.
- Delete a task and clear completed tasks.
- Refresh the page and confirm that saved tasks are restored.
- Navigate the input, filters and task actions using only the keyboard.
- Check the layout at a narrow screen width.
- If possible, test with browser storage cleared or unavailable.

## What this project demonstrates

This project provides practice with DOM manipulation, event handling, arrays, functions, filtering, conditional rendering, browser storage and basic accessibility. The JavaScript is kept in a single file so the relationship between state, events and rendering is easy to follow.

## Known limitations

- Tasks are stored only in the browser where they were created.
- There is no authentication, backend, cross-device synchronisation or automated test suite.
- Task IDs combine the current timestamp with an incrementing counter. This is sufficient for a small project, but is not a general-purpose ID system.

## Author

Leonardo Alves · [@16alves02](https://github.com/16alves02) · [Portfolio](https://16alves02-com.vercel.app/)

See [LICENSE](LICENSE) for the terms under which this source code may be used.
