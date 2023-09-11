const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
    List = "list",
    Add = "add",
    Remove = "remove",
    Quit = "quit"
}
  
enum ConsoleColors {
  Success = "success",
  Error = "error",
  Info = "info",
}

type InquirerAnswers = {
    action: Action
}

type User = {
  name: string;
  age: number;
}
class Message {
  content: string;

  constructor(content: string) {
    this.content = content;
  }
  public show() {
    console.log(this.content);
  }
  public capitalize() {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
    return this;
  }
  public toUpperCase() {
    this.content = this.content.toUpperCase();
    return this;
  }
  public toLowerCase() {
    this.content = this.content.toLowerCase();
    return this;
  }
  public static showColorized(variant: ConsoleColors, text: string) {
    switch (variant) {
      case ConsoleColors.Success:
        consola.success(text);
        break;
      case ConsoleColors.Error:
        consola.error(text);
        break;
      case ConsoleColors.Info:
        consola.info(text);
        break;
      default:
        console.log(text);
    }
  }
}

class UsersData {
  data: { name: User["name"], age: User["age"] }[] = [];

  showAll() {
    Message.showColorized(ConsoleColors.Info, "Users data");
    if(!this.data || this.data.length === 0) {
      Message.showColorized(ConsoleColors.Error, "No data...");
    } else {
      console.table(this.data);
    }
  }

  public add(user: User) {
    if (
      typeof user.name === "string" &&
      user.name.length > 0 &&
      typeof user.age === "number" &&
      user.age > 0
    ) {
      const capitalizedUser = new Message(user.name);
      capitalizedUser.toLowerCase().capitalize();

      this.data.push({ name: capitalizedUser.content, age: user.age });
      Message.showColorized(ConsoleColors.Success, "User has been successfully added!");
    } else {
      Message.showColorized(ConsoleColors.Error, "Wrong data!");
    }
  }

  public remove(user: string) {
    const capitalizedUser = new Message(user);
    capitalizedUser.toLowerCase().capitalize();

    const filteredData = this.data.filter(item => item.name !== capitalizedUser.content);

    if(filteredData.length < this.data.length) {
      this.data = filteredData;
      Message.showColorized(ConsoleColors.Success, "User deleted!");
    } else {
      Message.showColorized(ConsoleColors.Error, "User not found...");
    }
  }
  }

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(ConsoleColors.Info, "Availble actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you? \n',
  }]).then( async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(ConsoleColors.Info, "Bye Bye!");
        return;
      default:
        Message.showColorized(ConsoleColors.Error, "Command not found");
        break;
    }
    startApp();
  });
}

startApp();

