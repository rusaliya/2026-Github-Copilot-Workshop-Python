# Pomodoro Timer Web App Architecture Proposal

## Design Policy
- Simple and intuitive UI (central timer display, control buttons, status display)
- Color switch for focus/break
- Responsive layout

## Architecture Overview

### Frontend
- **HTML/CSS**: UI structure, layout based on mockup
- **JavaScript**: Timer logic, state management, button actions
- **Ajax/Fetch API**: Communication with server (for history saving, etc.)

### Backend (Flask)
- Timer state and history management
- RESTful API design (JSON responses)
- Template rendering (Jinja2)

### Example Directory Structure
```
1.pomodoro/
    app.py
    timer.py         # Timer logic
    db.py            # DB wrapper
    templates/
        index.html
    static/
        css/style.css
        js/timer.js
    tests/
        test_app.py
        test_timer.py
        test_db.py
        js/
            test_timer.js
```

## Improvements for Unit Testing
1. Structure Flask app (split routes, logic, test config)
2. Separate timer logic (functions/classes in JS)
3. Clear API design (RESTful, JSON responses)
4. Abstract DB access (wrappers, easy mocking)
5. Add test directory (Flask/JS test code)
6. Use dependency injection (for Flask/DB)
7. Introduce CI/CD and test tools (pytest, Flask-Testing, Jest, etc.)

## Main Features
- Timer countdown (JS, frontend state)
- Pomodoro count/history saving (Flask API, DB integration)
- UI state switching (focus/break/complete)

---

This structure enables easy testing, extensibility, and maintainability for the web app.
