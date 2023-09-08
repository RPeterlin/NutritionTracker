import { createServer, Model, Response } from "miragejs";



createServer({
  models: {
    users: Model,
    meals: Model,
  },
  seeds(server) {
    server.create("user", {id: "123", email: "a@a.com", password: "123", name: "Rok"})
    server.create("user", {id: "456", email: "b@b.com", password: "456", name: "Yes"})
  },
  routes(){
    this.namespace = "api";
    this.logging = false;
    // this.timing = 2000;

    this.post("/login", (schema, request) => {
      // Naive version of authentication!!!!!
      const {email, password} = JSON.parse(request.requestBody);
      const foundUser = schema.users.findBy({email, password});
      if (!foundUser){
        return new Response(401, {}, { message: "No user with those credentials found!" })
      }

      foundUser.password = undefined;
      return {
        user: foundUser,
        token: "Some token..."
      };
    })
  }
});
