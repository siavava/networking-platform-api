import Task from '../models/task_model';
import Company from '../models/company_model';
import Person from '../models/person_model';

export async function createTask(taskFields) {
  const task = new Task();
  task.title = taskFields.title;
  task.description = taskFields.description || '';
  task.tags = taskFields.tags || [];
  task.dueDate = taskFields.dueDate || null;
  task.associatedCompany = taskFields.associatedCompany || null;
  task.associatedPerson = taskFields.associatedPerson || null;

  try {
    await task.validate();
    if (task.associatedPerson) {
      await addToAssociatedPerson(task.associatedPerson, taskFields.associatedCompany, task);
    } else if (task.associatedCompany) {
      await addToAssociatedCompany(task.associatedCompany, task);
    }
    const savedTask = await task.save();

    return savedTask;
  } catch (error) {
    throw new Error(`create task error: ${error}`);
  }
}

export async function getTasks() {
  try {
    const tasks = await Task.find({}, 'title tags description');
    return tasks;
  } catch (error) {
    throw new Error(`get task error: ${error}`);
  }
}

export async function findTasks(query) {
  try {
    const searchedTask = await Task.find({ $text: { $search: query } }, 'title tags description');
    return searchedTask;
  } catch (error) {
    throw new Error(`get task error: ${error}`);
  }
}

export async function getTask(id) {
  try {
    const task = await Task.findById(id);
    if (!task) {
      throw new Error('unable to find task');
    }
    return task;
  } catch (error) {
    throw new Error(`get task error: ${error}`);
  }
}

export async function deleteTask(id) {
  try {
    const task = await Task.findById(id);
    if (task.associatedPerson) {
      deleteFromExAssociatedPerson(task);
    }
    if (task.associatedCompany) {
      deleteFromExAssociatedCompany(task);
    }
    const deletedTask = await Task.deleteOne({ _id: task._id });
    return deletedTask;
  } catch (error) {
    throw new Error(`delete task error: ${error}`);
  }
}

export async function updateTask(id, taskFields) {
  try {
    const task = await Task.findById(id);
    const {
      title, description, dueDate, tags, associatedCompany, associatedPerson,
    } = taskFields;
    if (title) {
      task.title = title;
    }
    if (description) {
      task.description = description;
    }
    if (dueDate) {
      task.description = description;
    }
    if (tags) {
      task.tags = tags;
    }
    if (associatedPerson && task.associatedPerson.toString() !== associatedPerson) {
      await task.validate();
      await deleteFromExAssociatedCompany(task);
      await deleteFromExAssociatedPerson(task);
      await addToAssociatedPerson(associatedPerson, associatedCompany, task);
      task.associatedPerson = associatedPerson;
    } else if (associatedCompany && task.associatedCompany.toString() !== associatedCompany) {
      if (task.associatedPerson) {
        throw new Error('cannot associate task to a new company if it is already associated with a person in existing company');
      }
      await task.validate();
      await deleteFromExAssociatedCompany(task);
      await addToAssociatedCompany(associatedCompany, task);
      task.associatedCompany = associatedCompany;
    }
    const savedTask = await task.save();
    return savedTask;
  } catch (error) {
    throw new Error(`update task error: ${error}`);
  }
}

async function addToAssociatedCompany(companyId, task) {
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('unable to find company');
    }
    company.tasks.push(task.id);
    const savedCompany = await company.save();
    return savedCompany;
  } catch (error) {
    throw new Error(`update associated company error: ${error}`);
  }
}

async function deleteFromExAssociatedCompany(task) {
  try {
    const company = await Company.findById(task.associatedCompany);
    company.tasks.pull(task.id);
    const savedCompany = await company.save();
    return savedCompany;
  } catch (error) {
    throw new Error(`update associated company error: ${error}`);
  }
}

async function addToAssociatedPerson(personId, companyId, task) {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error('unable to find person');
    }
    if (companyId) {
      if (person.associatedCompany && person.associatedCompany.toString() !== companyId) {
        throw new Error('mismatch between associated company and associated person');
      } else {
        addToAssociatedCompany(companyId, task);
        task.associatedCompany = companyId;
      }
    } else if (person.associatedCompany) {
      addToAssociatedCompany(person.associatedCompany, task);
      task.associatedCompany = person.associatedCompany;
    }
    person.tasks.push(task.id);
    const savedPerson = await person.save();
    return savedPerson;
  } catch (error) {
    throw new Error(`update associated person error: ${error}`);
  }
}

async function deleteFromExAssociatedPerson(task) {
  try {
    const person = await Person.findById(task.associatedPerson);
    person.tasks.pull(task.id);
    const savedPerson = await person.save();
    return savedPerson;
  } catch (error) {
    throw new Error(`update associated person error: ${error}`);
  }
}
