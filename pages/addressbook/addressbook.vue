<template>
  <div class="addressbook" style="background-color: #f6f6fb;">
    <next-indexed-xlist :dataList="dataList" :showAvatar="true" @itemclick="itemclick">
    </next-indexed-xlist>
  </div>
</template>

<script>
export default {
  name: 'addressbook',
  data() {
    return {
      dataList:[],
      queryItem: null,
      queryList: [],
    }
  },
  methods: {
    getAddress() {
      let self = this;
      plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressbook) => {
        console.log(addressbook, 'addressbook');
        // 使用 try catch 捕获异常
        addressbook.find(["displayName", "phoneNumbers"], res => {
          console.log(res, 'res');
          self.dataList = []
          res.forEach(item => {
            self.dataList.push({
              id: item.id,
              name: item.displayName,
              phone: item.phoneNumbers[0].value,
            })
          });
          console.log(self.dataList, 'this.dataList');
        })

      }, (e) => {
        console.log(e, 'e');
        uni.showToast({
          title: e.message,
          duration: 3000
        });
      });
    },
    itemclick(item) {
      console.log(item, 'item');
      item = {
        ...item,
        realname: item.name,
        mobile: item.phone,
        relationship: '父母',
      }
      console.log(this.queryList, this.queryItem, item,'this.queryList');
      // this.$set(this.queryList, this.queryItem, item);
      this.queryList[this.queryItem] = item;
      console.log(this.queryList, 'this.queryList');
      // return 
      if (this.queryList) {
        uni.redirectTo({
          url: '../contact/contact?list=' + JSON.stringify(this.queryList),
        });
      }
    },
  },
  onLoad(query) {
    console.log(query, 'query');
    const { item, list } = query;
    this.queryItem = item;
    this.queryList = JSON.parse(list);
    this.getAddress();
  },
}
</script>

<style lang="scss" scoped></style>