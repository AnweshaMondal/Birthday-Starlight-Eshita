import birthdayData from "@/data/birthday.json";
import type { BirthdayModel } from "@/models/birthday";
import BirthdayExperience from "@/components/BirthdayExperience";

export default function Home() {
  return <BirthdayExperience model={birthdayData as BirthdayModel} />;
}
