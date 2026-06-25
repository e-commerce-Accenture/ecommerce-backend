import fs from 'fs'

const file = "./src/repositories/data/profile.json"

export class ProfileRepository {
    create(data) {
        const newProfile = {
            id: data.id,
            userId: data.userId,
            address: {
                cep: data.cep,
                street: data.street,
                number: data.number,
                city: data.city,
                state: data.state
            }
        };

        const profiles = JSON.parse(fs.readFileSync(file, 'utf-8'));

        profiles.push(newProfile);

        const updateProfile = JSON.stringify(profiles, null, 2);

        fs.writeFileSync(file, profiles)

        return newProfile;
    }

    findProfileByUserId(userId) {
        const profiles = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = profiles.find(p => p.userId == userId);

        return finded;
    }

    update(userId, data) {
        const profiles = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = profiles.findIndex(p => p.userId == userId);

        profiles[index] = {
            ...profiles[index],
            ...(data.phone && { phone: data.phone }),
            ...(data.email && { email: data.email }),
            ...(data.address && {
                address: {
                    ...profiles[index].address,
                    ...data.address
                }
            })
        };

        const profilesUpdated = JSON.stringify(profiles, null, 2);

        fs.writeFileSync(file, profilesUpdated);

        return profiles[index];
    }

    deleteById(id) {
        const profiles = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const index = profiles.findIndex(p => p.id == id);

        profiles.splice(index, 1);

        const profilesUpdated = JSON.stringify(profiles, null, 2);

        fs.writeFileSync(file, profilesUpdated);
    }
}