<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { getUserProfile, updateUserPartial } from '@/api/user'
import { roleList, type RoleItem } from '@/constants/roles'
import { Card, Avatar, Tag, Spin, message, Modal, Input, Button } from 'ant-design-vue'
import { EditOutlined } from '@ant-design/icons-vue'

const user = ref<any>(null)
const loading = ref(true)
const editModalVisible = ref(false)
const nicknameInput = ref('')

const fetchProfile = async () => {
  loading.value = true
  try {
    const { data } = await getUserProfile()
    user.value = data
  } catch (e) {
    message.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const getRoleInfo = (role: string) => {
  return roleList.find((r: RoleItem) => r.value === role) || { label: role, isAdvanced: false }
}

const openEditModal = () => {
  nicknameInput.value = user.value.nickname
  editModalVisible.value = true
}
const handleEditOk = async () => {
  try {
    await updateUserPartial(user.value.id, { nickname: nicknameInput.value })
    editModalVisible.value = false
    message.success('昵称已更新')
    await fetchProfile()
  } catch (e) {
    message.error('昵称更新失败')
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-main flex flex-col items-start px-12 py-12 bg-white text-white">
    <div class="flex items-center mb-8">
      <div class="profile-avatar-wrap mr-8">
        <Avatar :src="user?.avatarUrl" :size="56" />
      </div>
      <Tag :color="getRoleInfo(user?.role).isAdvanced ? 'blue' : 'default'" class="text-xs px-4 py-1 rounded-full">
        {{ getRoleInfo(user?.role).label }}<span v-if="getRoleInfo(user?.role).isAdvanced" class="ml-1">(高级)</span>
      </Tag>
    </div>
    <Spin :spinning="loading">
      <div v-if="user" class="profile-card">
        <div class="profile-row">
          <span class="profile-label">用户昵称</span>
          <span class="profile-value">{{ user.nickname }}</span>
          <Button type="text" shape="circle" @click="openEditModal" class="profile-edit-btn">
            <template #icon><EditOutlined /></template>
          </Button>
        </div>
        <div class="profile-row">
          <span class="profile-label">手机号</span>
          <span class="profile-value">{{ user.mobile || '---' }}</span>
        </div>
        <div class="profile-row">
          <span class="profile-label">邮箱</span>
          <span class="profile-value">{{ user.email || '---' }}</span>
        </div>
        <div class="profile-row">
          <span class="profile-label">密码</span>
          <span class="profile-value">••••••••</span>
        </div>
      </div>
      <Modal v-model:open="editModalVisible" title="修改昵称" @ok="handleEditOk" okText="保存">
        <Input v-model:value="nicknameInput" :maxlength="20" />
      </Modal>
    </Spin>
  </div>
</template>

<style scoped>
.profile-main {
  min-height: 100vh;
}
.profile-avatar-wrap {
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 12px 0 #e0e7ff80;
}
.profile-card {
  border-radius: 20px;
  padding: 36px 0px;
  min-width: 340px;
  width: 50vw;
  max-width: 50vw;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.profile-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 18px;
  margin-bottom: 8px;
}
.profile-row:last-child {
  border-bottom: none;
}
.profile-label {
  color: #888;
  font-size: 14px;
  min-width: 64px;
}
.profile-value {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  flex: 1;
}
.profile-edit-btn {
  margin-left: 8px;
  color: #409eff;
  transition: color 0.2s;
}
.profile-edit-btn:hover {
  color: #1d4ed8;
  background: #f0f6ff;
}
</style> 