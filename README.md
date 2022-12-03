![GitHub](https://img.shields.io/github/license/Vabe/decaff)

# deCAFF

Online gallery for browsing, uploading and interacting with images based on the CAFF (CrySyS Animated File Format) format.

## ⚙️ Prerequisites

- node (tested with `v16.15.0`)
- yarn (tested with `1.22.5`)
- python (tested with `3.10.8`)
- MinGW (tested with `12.1.0`)
- Docker (tested with `20.10.17`)

## ⏳ Installation

⚠: Before running any of the commands, make sure to define the `.env` files and their values in the `./frontend` and `./backend` packages. Example values and the required keys can be found in their corresponding `README.md` files.

To install and start up the stack, run the following commands in order:

```bash
# From the root
# Parser initialisation
pip install -r .\requirements.txt
python api.py

# Backend initialisation
cd .\backend\

# install dependencies
yarn

# initialise db
# starts a docker container with PostgreSQL,
# runs all previous migrations, and generates prisma types
yarn db:init

# start backend
yarn dev

# Go back to root
cd ..

# Frontend
cd .\frontend\

# install dependencies
yarn

# start frontend
yarn dev
```

## 📖 Documentation

Please refer to the README in each package for package-specific information, and the Wiki for structural view.

## 📚 References

- [NestJS](https://nestjs.com/): Node.js framework for building efficient, reliable and scalable server-side applications
- [File up- and download](https://docs.nestjs.com/techniques/file-upload#file-upload): Nest provides a built-in module based on the multer middleware package for Express
- [Flask](https://flask.palletsprojects.com/en/2.2.x/): a micro web framework written in Python
- [python subprocess](https://docs.python.org/3/library/subprocess.html): allows spawning new processes, connecting to their input/output/error pipes, and obtaining their return codes
- [PostgreSQL](https://www.postgresql.org/): a powerful, open source object-relational database system
- [MUI](https://mui.com/): comprehensive suite of UI tools and components, highly customizable
- [ReactQuery](https://tanstack.com/query/v4/): asynchronous state management that supports [stale-while-revalidate](https://www.rfc-editor.org/rfc/rfc5861#section-3) caching mechanism
- [axios](https://axios-http.com/): promise-based HTTP client
- [lodash](https://lodash.com/): JS utility library
- [msw](https://mswjs.io/): next generation mocking that intercepts requests on the network level
- [prettier](https://prettier.io/): opinionated code formatter
