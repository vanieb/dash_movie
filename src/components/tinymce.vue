<template>
  <div>
    <editor
      :init="init"
      language="navLang"
      v-model="myContent"
      :initial-value="myContent"
      :name="name"
    />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import $ from "../utils/util";

export default {
  name: "tinymce",
  components: {
    editor: Editor,
  },
  props: ["content", "name", "id"],
  data() {
    return {
      myContent: this.content,
      init: {},
    };
  },
  watch: {
    myContent(newObj) {
      if (newObj !== undefined) {
        this.$emit("change-content", newObj);
      }
    },
  },
  created() {
    let _this = this;
    setTimeout(function() {
      _this.myContent = _this.content;
    }, 100);
    this.navLang = $.getLanguage();
    this.init = {
      height: 500,
      menubar: true,
      language: `${this.navLang}`,
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste code help wordcount",
      ],
      toolbar:
        "undo redo | formatselect | bold italic backcolor | \
         alignleft aligncenter alignright alignjustify | \
         bullist numlist outdent indent | removeformat | help",
    };
  },
};
</script>
<style scope>
.tox .tox-notification--warn,
.tox .tox-notification--warning {
  display: none !important;
}
</style>
