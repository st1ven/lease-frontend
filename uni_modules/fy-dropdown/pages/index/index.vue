<template>
	<view class="page page-index">
		<fy-dropdown :menuList="menuList">
			<fy-dropdown-item v-model="synthesisValue" dropdownKey="synthesis" :options="columnOptions" type="column" @change="handlerColumnChange"></fy-dropdown-item>
			<fy-dropdown-item v-model="priceValue" dropdownKey="price" :options="priceOptions" @change="handlerTypeChange"></fy-dropdown-item>
			<fy-dropdown-item v-model="salesValue" dropdownKey="sales" :options="salesOptions" @change="handlerTypeChange"></fy-dropdown-item>
		</fy-dropdown>
	</view>
</template>

<script>
export default {
	data() {
		return {
			menuList: [{ title: '综合排序', dropdownKey: 'synthesis' }, { title: '价格', dropdownKey: 'price' }, { title: '销量', dropdownKey: 'sales' }],
			synthesisValue: '',
			columnOptions: [
				{ title: '任务类型', key: 'type', default: '', list: [{ text: '全部', value: '' }, { text: '类型1', value: '2' }, { text: '类型2', value: '1' }] },
				{ title: '任务状态', key: 'status', default: '', list: [{ text: '全部', value: '' }, { text: '已完结', value: '1' }, { text: '工作中', value: '2' }] },
			],
			priceValue: '',
			priceOptions: [{ label: '筛选条件1', value: 1 }, { label: '筛选条件2', value: 2 }, { label: '筛选条件3', value: 3 }],
			salesValue: '',
			salesOptions: [{ label: '筛选条件3', value: 1 }, { label: '筛选条件33', value: 2 }, { label: '筛选条件333', value: 3 }],
		}
	},
	methods: {
		handlerColumnChange(e) {
			if (e.cancel) return;
			
			this.columnOptions.forEach(item=>{
				item.default = e.data[item.key];
			})
		},
		handlerTypeChange(e) {
			
		},
	}
}
</script>

<style lang="scss"></style>
