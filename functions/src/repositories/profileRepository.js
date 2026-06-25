import fs from 'fs'

const file = "./src/repositories/data/profile.json"

export class ProfileRepository {
    create(data) {
        
        const newProfile = {
            id: data.id,
            userId: data.userId,
            phone: data.phone,
            address: {
                cep: data.address?.cep || "",
                street: data.address?.street || "",
                number: data.address?.number || "",
                city: data.address?.city || "",
                state: data.address?.state || ""
            }
        };

        const profiles = JSON.parse(fs.readFileSync(file, 'utf-8'));

        profiles.push(newProfile);

        const updateProfile = JSON.stringify(profiles, null, 2);

        fs.writeFileSync(file, updateProfile)

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
            ...((data.cep || data.street || data.number || data.neighborhood || data.city || data.state) ? {
                address: {
                    ...(profiles[index].address || {}),
                    ...(data.cep && { cep: data.cep }),
                    ...(data.street && { street: data.street }),
                    ...(data.number && { number: data.number }),
                    ...(data.neighborhood && { neighborhood: data.neighborhood }),
                    ...(data.city && { city: data.city }),
                    ...(data.state && { state: data.state }),
                }
            } : {})
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