import models from "../models";
const clearDb = async () => {
  const res = await Promise.all([
    models.Project.deleteMany({}),
    models.User.deleteMany({}),
  ]);
  console.log(res);
};
clearDb();

/*
in server directory:
$ babel-node scripts/clearDb

^ doesnt seem to be wrking though, getting timeout error...
*/
