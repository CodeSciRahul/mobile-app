import Input from "@/components/ui/Input";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Receiver, ReceiversResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getReceivers } from "@/services/apiServices";
import { Switch } from "react-native";
import {Button, Checkbox} from "react-native-paper"
export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedReceivers, setSelectedReceivers] = useState<Receiver[]>([]);
  const { data: receivers, isLoading, refetch } = useQuery<ReceiversResponse>({
    queryKey: ['receivers'],
    queryFn: async () => {
      const response = await getReceivers();
      return response.data as ReceiversResponse;
    },
  });
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Input placeholder="Group Name" value={groupName} onChangeText={setGroupName} />
        <Input placeholder="Group Description" value={groupDescription} onChangeText={setGroupDescription} />

        <FlatList 
        data={receivers?.receivers || []} 
        renderItem={({ item }: { item: Receiver }) => <View className="">
          {/* <Text>{item.email}</Text> */}
          <Checkbox.Item label={item.email} status={selectedReceivers.includes(item) ? "checked" : "unchecked"} onPress={() => { setSelectedReceivers([...selectedReceivers, item]); }} />
        </View>} 
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No receivers found</Text>}
        ListFooterComponent={<Button mode="contained-tonal" className="bg-yellow-500" onPress={() => { console.log(groupName, groupDescription); }}>Create Group</Button>}
        />

      </View>
    </SafeAreaView>
  );
}