import Company from '../models/company_model';
import Person from '../models/person_model';

export async function createCompany(companyFields) {
  const company = new Company();
  company.name = companyFields.name;
  company.website = companyFields.website || '';
  company.linkedin = companyFields.linkedin || '';
  company.location = companyFields.location || '';
  company.description = companyFields.description || '';
  company.tags = companyFields.tags || [];
  company.notes = companyFields.notes || [];
  company.tasks = companyFields.tasks || [];
  company.associatedPeople = companyFields.associatedPeople || [];

  try {
    const savedCompany = await company.save();
    return savedCompany;
  } catch (error) {
    throw new Error(`create company error: ${error}`);
  }
}

export async function getCompanies() {
  try {
    const companies = await Company.find({}, 'name website tags associatedPeople');
    return companies;
  } catch (error) {
    throw new Error(`get company error: ${error}`);
  }
}

export async function findCompanies(query) {
  try {
    const searchedCompanies = await Company.find({ $text: { $search: query } }, 'name website tags associatedPeople');
    return searchedCompanies;
  } catch (error) {
    throw new Error(`get company error: ${error}`);
  }
}

export async function getCompany(id) {
  try {
    const company = await Company.findById(id);
    if (!company) {
      throw new Error('unable to find company');
    }
    return company;
  } catch (error) {
    throw new Error(`get company error: ${error}`);
  }
}

export async function deleteCompany(id) {
  try {
    const company = await Company.findById(id);
    if (company.associatedPeople) {
      company.associatedPeople.forEach(async (person) => {
        const associatedPerson = await Person.findById(person);
        associatedPerson.associatedCompany = null;
        await associatedPerson.save();
      });
    }
    return Company.deleteOne({ _id: company._id });
  } catch (error) {
    throw new Error(`delete company error: ${error}`);
  }
}

export async function updateCompany(id, companyFields) {
  try {
    const company = await Company.findById(id);
    const {
      name, website, linkedin, description, location, tags, associatedPeople, notes, tasks,
    } = companyFields;
    if (name) {
      company.name = name;
    }
    if (website) {
      company.website = website;
    }
    if (linkedin) {
      company.linkedin = linkedin;
    }
    if (location) {
      company.location = location;
    }
    if (description) {
      company.description = description;
    }
    if (tags) {
      company.tags = tags;
    }
    if (associatedPeople) {
      company.associatedPeople = associatedPeople;
    }
    if (notes) {
      company.notes = notes;
    }
    if (tasks) {
      company.tasks = tasks;
    }
    return company.save();
  } catch (error) {
    throw new Error(`delete company error: ${error}`);
  }
}
