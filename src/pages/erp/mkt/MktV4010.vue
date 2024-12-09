<template>
  <q-page class="q-pa-xs-xs q-pa-sm-md">
    <!-- contents zone -->
    <div class="row q-col-gutter-md">
      <!-- contents List -->
      <div class="col-12" :class="{ 'col-lg-4': isClassActive }">
        <q-card bordered>
          <!-- contents list title bar -->
          <q-bar class="q-px-sm">
            <q-icon name="list_alt" />
            <span class="q-px-sm text-bold text-subtitle1" :class="$q.dark.isActive ? 'text-orange' : 'text-primary'">{{ menuLabel }}</span>
            <q-space />
          </q-bar>
          <!--  end of contents list title bar -->
          <q-card-actions>
            <q-toolbar class="row">
              <div class="" style="max-width: 300px">
                <q-field dense label="영업담당" stack-label label-color="orange">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline">{{ storeUser.setEmpNm }}</div>
                  </template>
                </q-field>
              </div>
              <q-space />
              <div class="q-gutter-x-xs">
                <q-btn outline :color="$q.dark.isActive ? 'grey-4' : 'grey-9'" @click="addDataSection"
                  ><q-icon name="add" size="xs" class="q-mr-xs" /> 신규
                </q-btn>
                <q-btn v-if="!isLineBtnvisible && uniqueLineNos.length === 0" outline color="positive" @click="handleDocSend"
                  ><q-icon name="send" size="xs" class="q-mr-xs" /> 업무보고서
                </q-btn>
                <q-btn v-if="isKlineCheckVisible && isLineBtnvisible" outline color="deep-orange" @click="handleDocCancel"
                  ><q-icon name="delete" size="xs" class="q-mr-xs" /> 업무보고취소
                </q-btn>
              </div>
            </q-toolbar>
          </q-card-actions>

          <q-separator size="3px" />

          <q-card-section class="q-pa-xs">
            <div class="q-pa-sm">
              <q-date
                minimal
                style="width: 100%"
                color="orange"
                mask="YYYY-MM-DD"
                v-model="currentDate"
                :events="eventDays"
                :event-color="date => ($q.dark.isActive ? 'blue' : 'orange')"
                @update:model-value="onDateClick"
                @navigation="onNavigation"
                :default-year-month="currentYearMonth"
              />
            </div>
          </q-card-section>
          <q-card-section class="q-pa-xs">
            <div class="q-pa-sm">
              <div :style="contentZoneStyle">
                <ag-grid-vue
                  ref="myGrid"
                  style="width: 100%; height: 100%"
                  :class="$q.dark.isActive ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'"
                  :grid-options="gridOptions"
                >
                </ag-grid-vue>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <!--  end of contents list -->
      <!-- contents List -->
      <div v-if="isScreenVisible" class="col-12 col-lg-8">
        <q-form class="">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-sm">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
              <q-space />
              <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
              </q-chip>
            </q-bar>
            <!--  end of contents list title bar -->
            <q-card-actions>
              <q-toolbar class="row">
                <q-space />
                <div class="q-gutter-x-xs">
                  <q-btn v-if="isShowSaveBtn" outline color="primary" @click="saveDataSection"
                    ><q-icon name="save" size="xs" class="q-mr-xs" /> 저장
                  </q-btn>
                  <q-btn v-if="isShowDeleteBtn" outline color="negative" @click="deleteDataSection"
                    ><q-icon name="delete" size="xs" class="q-mr-xs" /> 삭제
                  </q-btn>
                </div>
              </q-toolbar>
            </q-card-actions>

            <q-separator size="3px" />

            <q-card-section class="q-pa-none">
              <div class="q-pa-md q-gutter-y-sm">
                <div class="row q-col-gutter-x-xl">
                  <q-input
                    :dense="dense"
                    class="col-xs-12 col-sm-4 text-subtitle1"
                    v-model="formData.stdDay"
                    type="date"
                    label="작성일자"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                  />

                  <q-select
                    :dense="dense"
                    class="col-xs-12 col-sm-3"
                    :disable="formDisable"
                    v-model="formData.typeCd"
                    :options="typeOptions"
                    label="일지유형"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    option-value="commCd"
                    option-label="commNm"
                    options-dense
                    emit-value
                    map-options
                  />

                  <q-select
                    :dense="dense"
                    :disable="!formData.projectCd"
                    class="super-small col-xs-12 col-sm-5 q-mr-none"
                    standout="text-white"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    label="프로젝트진행상태"
                    v-model="formData.stepCd"
                    :options="stepOptions"
                    option-value="stepCd"
                    option-label="stepNmX"
                    options-dense
                    emit-value
                    map-options
                  >
                    <template v-slot:after>
                      <q-btn padding="0px 0px 0px 0px" flat @click="isStepDialogVisible = true" :disable="!formData.projectCd">
                        <q-icon name="done" size="sm" />
                        <q-tooltip class="bg-orange text-dark" self="center right" :offset="[10, 30]"> 진행상태정보 변경하기 </q-tooltip>
                      </q-btn>
                    </template>
                    <q-tooltip class="bg-blue" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                      항상 해당프로젝트의 마지막 진행상태를 표기합니다.
                    </q-tooltip>
                  </q-select>
                </div>
                <div class="row q-col-gutter-x-xl">
                  <div class="col-xs-12 col-sm-10">
                    <q-input
                      ref="startFocus"
                      class="text-subtitle1"
                      :dense="dense"
                      v-model="formData.projectNm"
                      label="프로젝트명"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="5"
                      @keyup.enter="openHelpProjectDialog()"
                    >
                      <template v-slot:append>
                        <q-icon
                          size="0.8em"
                          v-if="formData.projectNm !== ''"
                          name="close"
                          @click="formData.projectNm = ''"
                          class="cursor-pointer q-pt-md"
                        />
                        <q-icon size="0.8em" name="search" @click="openHelpProjectDialog()" class="cursor-pointer q-pt-md" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-2">
                    <q-input
                      :dense="dense"
                      v-model="formData.projectCd"
                      label="관리코드"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      readonly
                      maxlength="100"
                    />
                  </div>
                </div>
                <div class="row">
                  <q-input
                    ref="subjectFocus"
                    :dense="dense"
                    class="col-12 text-subtitle1"
                    v-model="formData.subject"
                    label="제목"
                    :label-color="$q.dark.isActive ? 'green' : 'blue'"
                    :disable="formDisable"
                    maxlength="50"
                  />
                </div>
                <q-separator class="q-mb-md" />

                <div class="">
                  <!-- Color Picker and Apply Button -->
                  <div v-if="editColor" :style="colorPickerStyle">
                    <!--                    <q-btn icon="check" round color="green" @click="applyColor" />-->
                    <q-color v-model="textColor" no-header style="width: 90px" no-footer @click="applyColor" />
                  </div>

                  <q-editor
                    :disable="formDisable"
                    class="q-editor editor-container"
                    :style="contentEditZoneStyle"
                    ref="qEditorContents"
                    v-model="formData.contents"
                    :dense="$q.screen.lt.md"
                    :definitions="{
                      insert_img: {
                        tip: '사진 첨부',
                        label: '사진넣기',
                        icon: 'photo',
                        handler: insertImg,
                      },
                      font_color: {
                        tip: 'Change font color',
                        icon: 'colorize',
                        label: '글색상',
                        handler: fontColor,
                      },
                    }"
                    :toolbar="toolbar"
                    :fonts="fonts"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-splitter v-model="splitterModel" style="height: 155px">
                <template v-slot:before>
                  <q-tabs v-model="tabValue" vertical class="text-teal">
                    <q-tab :disable="uploadDisable" name="download" icon="download" label="파일목록" />
                    <q-tab :disable="uploadDisable" name="upload" icon="upload" label="업로드" />
                  </q-tabs>
                </template>

                <template v-slot:after>
                  <q-tab-panels v-model="tabValue" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
                    <q-tab-panel name="download">
                      <div class="row">
                        <div class="row col-xs-12 col-sm-12 col-md-10 q-gutter-x-lg">
                          <q-field dense borderless class="col-auto" v-for="(data, index) in rowDataFile" :key="index">
                            <template v-slot:prepend>
                              <span class="text-subtitle1"> {{ index + 1 }}:</span>
                              <!-- 체크박스 추가 -->
                              <q-checkbox dense v-model="selectedFiles" :val="data.fileName" class="" @update:model-value="toggleSelection(data)" />
                            </template>
                            <template v-slot:control>
                              <div
                                class="self-center full-width no-outline"
                                tabindex="0"
                                :style="{
                                  color: data.isDownloaded === '0' ? ($q.dark.isActive ? 'white' : 'black') : $q.dark.isActive ? 'grey' : 'grey',
                                }"
                              >
                                <span class="text-subtitle2"> {{ data.fileName }}</span>
                                <q-badge
                                  outline
                                  align="middle"
                                  :color="data.isDownloaded === '0' ? 'teal' : 'grey'"
                                  class="cursor-pointer q-ml-xs"
                                  @click="handleFileDownload(data)"
                                >
                                  {{ commUtil.formatFileSize(data.fileSize) }}
                                  <q-icon name="download" class="q-ml-sm" />
                                </q-badge>
                              </div>
                            </template>
                          </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-2 q-gutter-y-md">
                          <q-btn
                            v-if="rowDataFile.length > 0 && selectedFiles.length > 0"
                            dense
                            color="blue"
                            @click="allUnSelectedFiles"
                            class="q-px-md full-width"
                            ><q-icon name="done_all" class="q-mr-sm" />전체해제
                            <q-badge color="red" floating>{{ selectedFiles.length }}</q-badge>
                          </q-btn>
                          <q-btn
                            v-if="rowDataFile.length > 0 && selectedFiles.length === 0"
                            dense
                            color="blue"
                            @click="allDeleteSelectedFiles"
                            class="q-px-md full-width"
                            ><q-icon name="done_all" class="q-mr-sm" />전체선택
                          </q-btn>
                          <q-btn v-if="selectedFiles.length > 0" dense color="red" @click="deleteSelectedFiles" class="q-px-md full-width"
                            ><q-icon name="delete" class="q-mr-sm" />파일삭제하기</q-btn
                          >
                        </div>
                      </div>
                    </q-tab-panel>

                    <q-tab-panel name="upload">
                      <q-uploader
                        :bordered="false"
                        ref="uploaderRef"
                        :disable="uploadDisable"
                        label="첨부파일"
                        multiple
                        class="full-width"
                        style="max-height: 115px"
                        :color="$q.dark.isActive ? 'grey-9' : 'grey-4'"
                        :text-color="$q.dark.isActive ? 'white' : 'black'"
                        no-thumbnails
                        :max-file-size="maxFileSize"
                        :factory="factoryFiles"
                      >
                        <template v-slot:list="scope">
                          <q-list class="row">
                            <q-item v-for="file in scope.files" :key="file.__key">
                              <q-item-section>
                                <q-item-label class="full-width ellipsis">
                                  {{ file.name }}
                                </q-item-label>

                                <!--                          <q-item-label caption> Status: {{ file.__status }} </q-item-label>-->

                                <q-item-label caption> {{ file.__sizeLabel }} / {{ file.__progressLabel }} </q-item-label>
                              </q-item-section>

                              <!--                        <q-item-section v-if="file.__img" thumbnail class="gt-xs">-->
                              <!--                          <img :src="file.__img.src" />-->
                              <!--                        </q-item-section>-->

                              <q-item-section top side>
                                <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="scope.removeFile(file)" />
                              </q-item-section>
                            </q-item>
                          </q-list>
                        </template>
                      </q-uploader>
                    </q-tab-panel>
                  </q-tab-panels>
                </template>
              </q-splitter>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
      <!--  end of contents list -->
    </div>

    <q-dialog v-model="isDialogVisible" maximized persistent full-width full-height backdrop-filter="contrast(40%)">
      <q-card class="">
        <q-card-section class="q-pa-none">
          <q-form class="q-pa-none">
            <q-card bordered>
              <!-- contents list title bar -->
              <q-bar class="q-px-xs q-py-lg">
                <q-icon name="list_alt" />
                <span class="text-subtitle2 q-px-sm">자료 조회/조정</span>
                <q-space />
                <q-chip v-if="isShowStatusEdit" size="sm" outline :color="statusEdit.color" class="q-px-md">
                  <q-icon :name="statusEdit.icon" class="q-mr-sm" size="15px" /> {{ statusEdit.message }}
                </q-chip>
                <q-btn v-close-popup class="text-white bg-grey-8"><q-icon name="close" size="xs" class="" /> 닫기</q-btn>
              </q-bar>
              <!--  end of contents list title bar -->
              <q-card-actions align="right" class="q-pa-none">
                <q-toolbar class="row">
                  {{ storeUser.setEmpNm }}
                  <q-space />
                  <div class="q-gutter-xs">
                    <q-btn v-if="isShowSaveBtn" outline color="primary" dense @click="saveDataSection"><q-icon name="save" size="xs" /> 저장 </q-btn>
                    <q-btn v-if="isShowDeleteBtn" outline color="negative" dense @click="deleteDataSection"
                      ><q-icon name="delete" size="xs" /> 삭제
                    </q-btn>
                  </div>
                </q-toolbar>
              </q-card-actions>

              <q-separator size="3px" />

              <q-card-section class="q-pa-none">
                <div class="q-pa-md q-gutter-y-sm">
                  <div class="row q-col-gutter-x-xl">
                    <q-input
                      :dense="dense"
                      class="col-xs-6 col-sm-6 text-subtitle1"
                      v-model="formData.stdDay"
                      type="date"
                      label="작성일자"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                    />

                    <q-select
                      :dense="dense"
                      class="col-xs-6 col-sm-6"
                      :disable="formDisable"
                      v-model="formData.typeCd"
                      :options="typeOptions"
                      label="일지유형"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      option-value="commCd"
                      option-label="commNm"
                      options-dense
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="row q-col-gutter-x-md">
                    <div class="col-xs-10 col-sm-10">
                      <q-input
                        ref="startFocus"
                        class="text-subtitle1"
                        :dense="dense"
                        v-model="formData.projectNm"
                        label="프로젝트명"
                        :label-color="$q.dark.isActive ? 'green' : 'blue'"
                        :disable="formDisable"
                        maxlength="5"
                        @keyup.enter="openHelpProjectDialog()"
                      >
                        <template v-slot:append>
                          <q-icon
                            size="0.8em"
                            v-if="formData.projectNm !== ''"
                            name="close"
                            @click="formData.projectNm = ''"
                            class="cursor-pointer q-pt-md"
                          />
                          <q-icon size="0.8em" name="search" @click="openHelpProjectDialog()" class="cursor-pointer q-pt-md" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                      <q-input
                        :dense="dense"
                        v-model="formData.projectCd"
                        label="관리코드"
                        :label-color="$q.dark.isActive ? 'green' : 'blue'"
                        readonly
                        maxlength="100"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <q-input
                      ref="subjectFocus"
                      :dense="dense"
                      class="col-12 text-subtitle1"
                      v-model="formData.subject"
                      label="제목"
                      :label-color="$q.dark.isActive ? 'green' : 'blue'"
                      :disable="formDisable"
                      maxlength="50"
                    >
                      <template v-slot:append>
                        <q-btn dense icon="mic" @click="startVoiceRecognition_subject" />
                        <q-btn dense icon="stop" @click="stopVoiceRecognition_subject" />
                      </template>
                    </q-input>
                  </div>
                  <q-separator class="q-mb-md" />
                  <div class="">
                    <q-editor
                      ref="qInput"
                      :disable="formDisable"
                      class="q-editor editor-container"
                      :style="contentEditZoneStyleDialog"
                      v-model="formData.contents"
                      :dense="$q.screen.lt.md"
                      :definitions="definitions"
                      :toolbar="toolbarMobile"
                      :fonts="fonts"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-splitter v-model="splitterModelXs" style="height: 145px">
            <template v-slot:before>
              <q-tabs v-model="tabValue" vertical class="text-teal">
                <q-tab :disable="uploadDisable" name="download" icon="download" label="파일목록" />
                <q-tab :disable="uploadDisable" name="upload" icon="upload" label="업로드" />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels v-model="tabValue" animated vertical transition-prev="jump-up" transition-next="jump-up">
                <q-tab-panel name="download">
                  <div class="row">
                    <div class="row col-xs-12 col-sm-12 col-md-10 q-gutter-x-lg">
                      <q-field dense borderless class="col-auto" v-for="(data, index) in rowDataFile" :key="index">
                        <template v-slot:prepend>
                          <span class="text-subtitle1"> {{ index + 1 }}:</span>
                          <!-- 체크박스 추가 -->
                          <q-checkbox dense v-model="selectedFiles" :val="data.fileName" class="" @update:model-value="toggleSelection(data)" />
                        </template>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                            :style="{
                              color: data.isDownloaded === '0' ? ($q.dark.isActive ? 'white' : 'black') : $q.dark.isActive ? 'grey' : 'grey',
                            }"
                          >
                            <span class="text-subtitle2"> {{ data.fileName }}</span>
                            <q-badge
                              outline
                              align="middle"
                              :color="data.isDownloaded === '0' ? 'teal' : 'grey'"
                              class="cursor-pointer q-ml-xs"
                              @click="handleFileDownload(data)"
                            >
                              {{ commUtil.formatFileSize(data.fileSize) }}
                              <q-icon name="download" class="q-ml-sm" />
                            </q-badge>
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-2 q-gutter-y-md">
                      <q-btn
                        v-if="rowDataFile.length > 0 && selectedFiles.length > 0"
                        dense
                        color="blue"
                        @click="allUnSelectedFiles"
                        class="q-px-md full-width"
                        ><q-icon name="done_all" class="q-mr-sm" />전체해제
                        <q-badge color="red" floating>{{ selectedFiles.length }}</q-badge>
                      </q-btn>
                      <q-btn
                        v-if="rowDataFile.length > 0 && selectedFiles.length === 0"
                        dense
                        color="blue"
                        @click="allDeleteSelectedFiles"
                        class="q-px-md full-width"
                        ><q-icon name="done_all" class="q-mr-sm" />전체선택
                      </q-btn>
                      <q-btn v-if="selectedFiles.length > 0" dense color="red" @click="deleteSelectedFiles" class="q-px-md full-width"
                        ><q-icon name="delete" class="q-mr-sm" />파일삭제하기</q-btn
                      >
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="upload">
                  <q-uploader
                    :bordered="false"
                    ref="uploaderRef"
                    :disable="uploadDisable"
                    label="첨부파일"
                    multiple
                    class="full-width"
                    style="max-height: 115px"
                    :color="$q.dark.isActive ? 'grey-9' : 'grey-4'"
                    :text-color="$q.dark.isActive ? 'white' : 'black'"
                    no-thumbnails
                    :max-file-size="maxFileSize"
                    :factory="factoryFiles"
                  >
                    <template v-slot:list="scope">
                      <q-list class="row">
                        <q-item v-for="file in scope.files" :key="file.__key">
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">
                              {{ file.name }}
                            </q-item-label>

                            <!--                          <q-item-label caption> Status: {{ file.__status }} </q-item-label>-->

                            <q-item-label caption> {{ file.__sizeLabel }} / {{ file.__progressLabel }} </q-item-label>
                          </q-item-section>

                          <!--                        <q-item-section v-if="file.__img" thumbnail class="gt-xs">-->
                          <!--                          <img :src="file.__img.src" />-->
                          <!--                        </q-item-section>-->

                          <q-item-section top side>
                            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="scope.removeFile(file)" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </template>
                  </q-uploader>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isStepDialogVisible" persistent backdrop-filter="contrast(40%)" @hide="getDataStepCheck">
      <q-card class="" style="width: 700px; max-width: 100vw">
        <q-card-section class="q-pa-none">
          <q-card bordered>
            <!-- contents list title bar -->
            <q-bar class="q-px-xs q-py-lg">
              <q-icon name="list_alt" />
              <span class="text-subtitle2 q-px-sm">프로젝트 진행상태관리</span>
              <q-space />
              <q-btn v-close-popup class="text-white bg-grey-8"><q-icon name="close" size="xs" class="" /> 닫기</q-btn>
            </q-bar>
            <!--  end of contents list title bar -->
          </q-card>
        </q-card-section>
        <q-card-section> <STEP_EDIT :message="{ projectCd: formData.projectCd }" /> </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <q-dialog v-model="isSendDialogVisible" :maximized="$q.screen.lt.md" full-height backdrop-filter="contrast(40%)">
    <mkt-v4011 @sendData="handleDataFromChild" :message="selectedRows" />
  </q-dialog>
</template>

<script setup>
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridVue } from 'ag-grid-vue3';
import { QBtn, QIcon, QToggle, useQuasar } from 'quasar';
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { api } from '/src/boot/axios';

import { isEqual } from 'lodash';
import jsonUtil from 'src/js_comm/json-util';
import notifySave from 'src/js_comm/notify-save';
import commUtil from 'src/js_comm/comm-util';
import { useUserInfoStore } from 'src/store/setUserInfo';
import HelpProject from 'components/subvue/HelpProject.vue';
import STEP_EDIT from 'pages/erp/mst/STEP_EDIT.vue';
import MktV4011 from 'pages/erp/mkt/MktV4011.vue';

const storeUser = useUserInfoStore();
const $q = useQuasar();
const dense = ref(false);
let isSaveFg = null;
const isLineBtnvisible = ref(false);

// 오늘날자 setting
const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
const currentDate = ref(formattedDate);
// 오늘날자 setting 끝

const eventDays = ref([]);
const selectedDate = reactive({
  date: '',
  year: '',
  month: '',
  day: '',
});

const searchParam = reactive({
  consCd: '',
  stepCd: '',
  word: '',
});
const statusEdit = reactive({
  icon: '',
  message: '',
  color: '',
});

const handleDocSend = () => {
  if (selectedRows.value.length > 0) {
    $q.dialog({
      dark: true,
      title: '업무일지 결재요청',
      message: selectedRows.value.length + ' 건의 업무일지를 선택 하셨습니다.<br>확인 후 결재 요청을 진행하시겠습니까? ',
      cancel: true,
      html: true,
      // ok: {
      //   push: true,
      //   color: 'primary',
      // },
      // cancel: {
      //   push: true,
      //   color: 'grey-7',
      // },
      // persistent: true,
    })
      .onOk(() => {
        // alert('>>>> OK ');
        isSendDialogVisible.value = true;
      })
      .onOk(() => {
        // alert('>>>> second OK catcher');
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  } else {
    alert('선택된 일지가 없습니다.');
  }
};
const handleDocCancel = () => {
  if (selectedRows.value.length > 0) {
    $q.dialog({
      dark: true,
      title: '업무일지 결재요청 취소',
      message:
        '문서번호 : ' +
        '<span class="text-orange text-bold">' +
        uniqueLineNos.value.length +
        '</span>' +
        '건의 업무일지를 취소합니다.<br>결재취소를 진행하시겠습니까? ',
      html: true,
      ok: {
        label: '결재취소 진행',
        push: true,
        color: 'primary',
      },
      cancel: {
        label: '닫기',
        push: true,
        color: 'grey-7',
      },
      // persistent: true,
    })
      .onOk(() => {
        // alert('>>>> OK ');
        let iu = [];
        let iuD = [];
        for (let i = 0; i < uniqueLineNos.value.length; i++) {
          const tmpJsonU = '{"mode":"U","data": { "lineCd": "7011101", "lineNo": ' + uniqueLineNos.value[i] + ' } }';
          iu.push(tmpJsonU);

          const tmpJsonD = '{"mode":"D","data": { "lineCd": "7011101", "lineNo": ' + uniqueLineNos.value[i] + ' } }';
          iuD.push(tmpJsonD);
        }
        saveDataAndHandleResultCancel(jsonUtil.jsonFiller(iu, iuD))
          .then(res => {
            // 첨부파일 삭제부분
            if (res.data.rtn === '0') {
              for (let i = 0; i < uniqueLineNos.value.length; i++) {
                const fileKey = '7011101_' + uniqueLineNos.value[i];
                // console.log('fileKey11 : ', fileKey);
                deleteLineFilesAll(fileKey);
              }
            }
            handleGetDataEvent();
          })
          .catch(error => {
            console.error('Error received: ', error);
          });
      })
      .onOk(() => {
        // alert('>>>> second OK catcher');
      })
      .onCancel(() => {
        // console.log('>>>> Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  } else {
    alert('선택된 일지가 없습니다.');
  }
};

function handleDataFromChild(data) {
  isSendDialogVisible.value = false;
  getData();
}

const handleGetDataEvent = () => {
  getEventData(viewDateYYMM.year, viewDateYYMM.month).then(() => {
    onDateClick(currentDate.value);
  });
};

const currentYearMonth = ref(null);
const viewDateYYMM = reactive({
  year: currentDate.value.substring(0, 4),
  month: currentDate.value.substring(5, 7),
});
function onNavigation(event) {
  viewDateYYMM.year = event.year;
  viewDateYYMM.month = event.month;
  getEventData(event.year, event.month).then(() => {
    rowData.rows = [];
    myGrid.value.api.setGridOption('rowData', rowData.rows);
    formDisable.value = true;
    uploadDisable.value = true;
    isShowSaveBtn.value = false;
    isShowDeleteBtn.value = false;
    resetFormData();
  });
}

const onDateClick = resSelectedDate => {
  if (resSelectedDate) {
    const [year, month, day] = resSelectedDate.split('-');
    selectedDate.year = `${year}`;
    selectedDate.month = `${month}`;
    selectedDate.day = `${day}`;
    selectedDate.date = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    getData();
  }
};

const formDisable = ref(false);
const uploadDisable = ref(true);
const isScreenVisible = ref(true);
const isDialogVisible = ref(false);
const isSendDialogVisible = ref(false);
const isStepDialogVisible = ref(false);
const isClassActive = ref(true);
const uniqueLineNos = ref('');

const contentZoneHeight = ref(500);
const handleResize = () => {
  contentZoneHeight.value = window.innerHeight - 560;
};
const contentZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value}px`,
}));
const contentEditZoneStyle = computed(() => ({
  height: `${contentZoneHeight.value - 60}px`,
}));
const contentEditZoneStyleDialog = computed(() => ({
  height: `${contentZoneHeight.value + 70}px`,
}));

const rowData = reactive({ rows: [] });

const isVoiceRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window;
};

onBeforeUnmount(() => {
  // Remove the resize event listener when the component is destroyed
  window.removeEventListener('resize', handleResize);
});
onBeforeMount(() => {
  isDialogVisible.value = false;
  isScreenVisible.value = $q.screen.gt.md;

  currentYearMonth.value = commUtil.getTodayYear() + '/' + commUtil.getTodayMonth();

  if (isVoiceRecognitionSupported()) {
    console.log('음성인식 지원');
    // alert('음성인식 지원');
    // You can initialize the speech recognition here
  } else {
    // alert('해당 브라우저에서 음성인식이 진원되지않습니다.');
    console.log('해당 브라우저에서 음성인식이 진원되지않습니다.');
  }

  // 영업일지유형
  getDataCommOption('302').then(() => {
    getEventData(commUtil.getTodayYear(), commUtil.getTodayMonth()).then(() => {
      handleGetDataEvent();
    });
  });
});

const menuLabel = ref('');
let quillInstance = null;
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
  menuLabel.value = window.history.state.label;
  if (qEditorContents.value) {
    quillInstance = qEditorContents.value.quill; // Get Quill instance after mount
  }
});

const columnDefs = ref([
  {
    headerName: '',
    field: '',
    maxWidth: 50,
    minWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    filter: false,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '담당자',
    field: 'salesNm',
    filter: false,
    minWidth: 80,
    pinned: !$q.screen.xs && !$q.screen.sm ? 'left' : null,
  },
  {
    headerName: '활동일지내용',
    field: 'subject',
    filter: false,
    minWidth: 100,
  },
  {
    headerName: '일지유형',
    field: 'typeNm',
    filter: false,
    minWidth: 80,
  },
  {
    headerName: '문서번호',
    field: 'lineNo',
    filter: false,
    minWidth: 100,
  },
]);

const oldFormData = ref(null);
const formData = ref({
  stdDay: commUtil.getTodayDay(),
  salesCd: storeUser.setSalesCd,
  seq: 0,
  projectCd: '',
  projectNm: '',
  typeCd: '',
  subject: '',
  contents: '',
  useYn: '',
  stepCd: '',
});
const resetFormData = () => {
  formData.value.stdDay = commUtil.getTodayDay();
  formData.value.salesCd = storeUser.setSalesCd;
  formData.value.projectCd = '';
  formData.value.projectNm = '';
  formData.value.typeCd = '3021990';
  formData.value.subject = '';
  formData.value.contents = '';
  formData.value.useYn = 'Y';
  formData.value.stepCd = '';
};

const selectedRows = ref([]);
const isShowStatusEdit = ref(false);
const isShowDeleteBtn = ref(false);
const isShowSaveBtn = ref(false);

const startFocus = ref(null);
const subjectFocus = ref(null);
const addDataSection = () => {
  isDialogVisible.value = !$q.screen.gt.md;
  isScreenVisible.value = $q.screen.gt.md;

  rowDataFile.value = [];
  resetFormData();

  oldFormData.value = null;
  isShowStatusEdit.value = true;
  statusEdit.icon = 'edit';
  statusEdit.message = '신규입력모드 입니다';
  statusEdit.color = 'primary';
  isSaveFg = 'I';
  isShowSaveBtn.value = true;
  formDisable.value = false;
  uploadDisable.value = true;
  formData.value.useYn = 'Y';
  formData.value.stdDay = currentDate.value;
  setTimeout(() => {
    startFocus.value.focus();
  }, 100);
};
const deleteDataSection = () => {
  $q.dialog({
    dark: true,
    title: '자료삭제',
    message: '선택된 자료를 삭제하시겠습니까? ',
    ok: {
      push: true,
      color: 'negative',
    },
    cancel: {
      push: true,
      color: 'grey-7',
    },
    // persistent: true,
  })
    .onOk(() => {
      isSaveFg = 'D';

      let iu = [];
      let iuD = [];
      for (let i = 0; i < selectedRows.value.length; i++) {
        let tmpJson = '{"mode":"D","data":' + JSON.stringify(selectedRows.value[i]) + '}';
        iuD.push(tmpJson);
      }
      saveDataAndHandleResult(jsonUtil.jsonFiller(iu, iuD))
        .then(res => {
          if (res.data.rtn === '0') {
            const fileKey = '7011101_' + selectedRows.value[0].stdDay + '_' + selectedRows.value[0].salesCd + '_' + selectedRows.value[0].seq;
            // console.log('fileKey : ', fileKey);
            deleteSelectedFilesAll(fileKey);
          }
        })
        .catch(error => {
          console.error('Error received: ', error);
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // 확인/취소 모두 실행되었을때
    });
};
const saveDataSection = () => {
  formData.value.stdDay = commUtil.unFormatDate(formData.value.stdDay);

  if (isEqual(formData.value, oldFormData.value)) {
    $q.dialog({
      dark: true,
      title: '안내',
      message: '변경된 자료가 없습니다. ',
      // persistent: true,
    })
      .onOk(() => {})
      .onCancel(() => {})
      .onDismiss(() => {
        // 확인/취소 모두 실행되었을때
      });
  } else {
    saveDataAndHandleResult(jsonUtil.dataJsonParse(isSaveFg, formData.value))
      .then(res => {
        // console.log('Response received: ', res);
      })
      .catch(error => {
        console.error('Error received: ', error);
      });
  }
};

// **************************************************************//
// ***** DataBase 연결부분    *************************************//
// **************************************************************//

// ***** 이벤트  목록 자료 가져오기 부분  *****************************//
const getEventData = async (resYear, resMonth) => {
  try {
    const response = await api.post('/api/mkt/mkt4010_list_event', {
      paramYear: resYear,
      paramMonth: resMonth,
      paramSalesCd: storeUser.setSalesCd,
      paramLevel: '1',
    });
    eventDays.value.splice(0);
    for (let i = 0; i < response.data.data.length; i++) {
      let tmpDay = response.data.data[i].stdDay.replace(/(\d{4})(\d{2})(\d{2})/, '$1/$2/$3');
      eventDays.value.push(tmpDay);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// ***** 자료저장 및 삭제 처리부분 *****************************//
const saveDataAndHandleResult = resFormData => {
  return api
    .post('/api/mkt/mkt4010_save', resFormData)
    .then(res => {
      if (res.data.rtn === '0') {
        if (isSaveFg === 'D') {
          const selectedData = myGrid.value.api.getSelectedRows();
          myGrid.value.api.applyTransaction({ remove: selectedData });
        } else {
          getData();
        }
      }
      let saveStatus = {
        rtn: res.data.rtn,
        rtnMsg: res.data.rtnMsg,
      };
      notifySave.notifyView(saveStatus);

      handleGetDataEvent();
      return res;
    })
    .catch(error => {
      console.log('error: ', error);
      throw error;
    });
};
const saveDataAndHandleResultCancel = resFormData => {
  return api
    .post('/api/mkt/mkt4011_save_line', resFormData)
    .then(res => {
      getData();

      let saveStatus = {};
      saveStatus.rtn = res.data.rtn;
      saveStatus.rtnMsg = res.data.rtnMsg;
      notifySave.notifyView(saveStatus);

      return res; // Return the response object
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

const getData = async () => {
  rowDataFile.value = [];
  selectedFiles.value = [];
  selectedFullFiles.value = [];

  let paramSalesCd = null;
  if (storeUser.setSalesCd === '') {
    paramSalesCd = storeUser.setEmpCd;
  } else {
    paramSalesCd = storeUser.setSalesCd;
  }

  try {
    const response = await api.post('/api/mkt/mkt4010_list', {
      paramStdDay: commUtil.unFormatDate(currentDate.value),
      paramSalesCd: paramSalesCd,
    });
    rowData.rows = response.data.data;
    myGrid.value.api.setGridOption('rowData', rowData.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 사용자정보 목록 자료 가져오기 부분  *****************************//

// ***** 사용자정보 선택된 자료 가져오기 부분  *****************************//
const getDataSelect = async resValue => {
  try {
    const response = await api.post('/api/mkt/mkt4010_select', {
      paramStdDay: resValue.stdDay,
      paramSalesCd: resValue.salesCd,
      paramSeq: resValue.seq,
    });
    formData.value = response.data.data[0];
    oldFormData.value = JSON.parse(JSON.stringify(formData.value)); // 초기자료 저장
    formData.value.stdDay = commUtil.formatDate(response.data.data[0].stdDay);
    isKlineCheckVisible.value = false;
    if (formData.value.lineNo !== '') {
      getDataKlineCheck(formData.value.lineNo).then(resCnt => {
        isKlineCheckVisible.value = resCnt <= 1;
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const isKlineCheckVisible = ref(false);
const getDataKlineCheck = async resLineNo => {
  try {
    const response = await api.post('/api/aux/auxKline_check', {
      paramLineCd: '7011101',
      paramLineNo: resLineNo,
    });

    return response.data.data[0].checkCnt;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const typeOptions = ref(null);
async function getDataCommOption(resCommCd1) {
  try {
    const response = await api.post('/api/mst/comm_option_list', { paramCommCd1: resCommCd1 });
    switch (resCommCd1) {
      case '302': // 일wl유형
        typeOptions.value = response.data.data;
        break;
      default:
        typeOptions.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
const stepOptions = ref(null);
async function getDataStepOption(resProjectCd) {
  try {
    const response = await api.post('/api/mkt/step_list', { paramProjectCd: resProjectCd });
    stepOptions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// **************************************************************//
// ***** DataBase 연결부분 끝  *************************************//
// **************************************************************//

const myGrid = ref(null);
const gridOptions = {
  columnDefs: columnDefs.value,
  rowData: rowData.rows,
  defaultColDef: {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: false,
    editable: false,
  },
  pagination: false,
  rowSelection: 'multiple' /* 'single' or 'multiple',*/,
  enableColResize: false,
  enableSorting: true,
  enableFilter: false,
  enableRangeSelection: true,
  suppressRowClickSelection: false,
  animateRows: true,
  suppressHorizontalScroll: true,
  localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  getRowStyle: function (param) {
    if (param.node.rowPinned) {
      return { 'font-weight': 'bold', background: '#dddddd' };
    }
    return { 'text-align': 'left' };
  },
  getRowHeight: function (param) {
    // 고정된 행의 높이
    if (param.node.rowPinned) {
      return 45;
    }
    return 40;
  },
  // GRID READY 이벤트, 사이즈 자동조정
  onGridReady: function (event) {
    // console.log('Grid is ready'); // Check if grid initializes
    event.api.sizeColumnsToFit();
  },
  // 창 크기 변경 되었을 때 이벤트
  onGridSizeChanged: function (event) {
    event.api.sizeColumnsToFit();
  },
  onRowEditingStarted: function (event) {
    // console.log('never called - not doing row editing');
  },
  onRowEditingStopped: function (event) {
    // console.log('never called - not doing row editing');
  },
  onCellEditingStarted: function (event) {
    // console.log('cellEditingStarted');
  },
  onCellEditingStopped: function (event) {
    // console.log('cellEditingStopped');
  },
  onRowClicked: function (event) {
    // console.log('onRowClicked');
    isDialogVisible.value = !$q.screen.gt.md;
    isScreenVisible.value = $q.screen.gt.md;
    selectedRows.value = event.api.getSelectedRows();
    isShowStatusEdit.value = false;
    isShowDeleteBtn.value = selectedRows.value.length > 0 && storeUser.setLevelCd > '2';
    isShowSaveBtn.value = false;

    getDataSelect(selectedRows.value[0]).then(() => {
      tabValue.value = 'download';
      // getDataKlineCheck();
      getDataStepCheck().then(() => {
        if (formData.value.stepCd) {
          oldFormData.value.stepCd = formData.value.stepCd;
        }
        getDataStepOption(selectedRows.value[0].projectCd).then(() => {
          isShowSaveBtn.value = true;
          isShowDeleteBtn.value = true;

          isShowStatusEdit.value = true;
          statusEdit.icon = 'edit_note';
          statusEdit.message = '수정/삭제모드 입니다';
          statusEdit.color = 'accent';
          isSaveFg = 'U';
          formDisable.value = false;
          uploadDisable.value = false;

          uploadFileList().then(() => {});
        });
      });
    });
  },
  onCellClicked: function (event) {
    // console.log('onCellClicked');
  },
  isRowSelectable: function (event) {
    // console.log('isRowSelectable');
    return true;
  },
  onSelectionChanged: function (event) {
    // console.log('onSelectionChanged1');
    rowDataFile.value = [];
    selectedRows.value = event.api.getSelectedRows();
    isShowStatusEdit.value = false;
    isShowDeleteBtn.value = selectedRows.value.length > 0;
    // const selectedOption = selectedRows.value.find(data => data.lineNo !== '');
    // const selectCount = selectedRows.value.filter(data => data.lineNo !== '').length;
    uniqueLineNos.value = [...new Set(selectedRows.value.map(data => data.lineNo).filter(lineNo => lineNo !== ''))];
    const lineNoCnt = uniqueLineNos.value.length;
    isLineBtnvisible.value = lineNoCnt > 0 && uniqueLineNos.value[0] !== '';
    // console.log('aa2 : ', lineNoCnt, selectedRows.value.length, uniqueLineNos.value[0]);
    isShowSaveBtn.value = false;

    isSaveFg = 'D';
    isShowStatusEdit.value = true;
    statusEdit.icon = 'delete';
    statusEdit.message = '삭제모드 입니다';
    statusEdit.color = 'negative';
    formDisable.value = true;
    uploadDisable.value = true;
    resetFormData();
  },
  onSortChanged: function (event) {
    // console.log('onSortChanged');
  },
  onCellValueChanged: function (event) {
    // console.log('onCellValueChanged');
  },
  getRowNodeId: function (data) {
    return null;
  },
  // 리드 상단 고정
  setPinnedTopRowData: function (data) {
    return null;
  },
  // 그리드 하단 고정
  setPinnedBottomRowData: function (data) {
    return null;
  },
  // components: {
  //   numericCellEditor: NumericCellEditor,
  //   moodEditor: MoodEditor,
  // },
  debug: false,
};

// **************************************************************//
// ***** Dialog Help 연결부분  ************************************//
// **************************************************************//
const useDialog = ref(false);
const openHelpProjectDialog = () => {
  useDialog.value = true;
  openHelpProjectDialog1();
};
const openHelpProjectDialog1 = () => {
  if (useDialog.value) {
    $q.dialog({
      component: HelpProject,
      componentProps: {
        paramValueNm: formData.value.projectNm,
        paramCloseDay: commUtil.unFormatDate(formData.value.stdDay),
      },
    })
      .onOk(res => {
        // console.log('res ::: ', res.valueCd, res.valueNm);
        formData.value.projectCd = res.valueCd;
        formData.value.projectNm = res.valueNm;
        setTimeout(() => {
          subjectFocus.value.focus();
        }, 500);
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        // console.log('Called on OK or Cancel');
        useDialog.value = false;
        getDataStepCheck();
      });
  } else {
  }
  setTimeout(() => {
    subjectFocus.value.focus();
  }, 500);
};

// ***** DataBase 설정기간자료 가져오기 부분 *****************************//

const getDataStepCheck = async () => {
  if (!formData.value.projectCd) {
  } else {
    try {
      const response = await api.post('/api/mkt/step_check', { paramProjectCd: formData.value.projectCd });
      if (response.data.data[0]) {
        formData.value.stepCd = response.data.data[0].stepCd;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
};
// ***** 검색 선택 자동 처리 부분 끝 *****************************//

// ***** Voice입력 처리부분 *****************************//
const listening = ref(false);
let recognition;

const toolbarMobile = [
  ['voice_start', 'voice_stop'],
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
    },
    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana'],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],

  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  ['insert_img'],
  ['hr', 'link'],
  ['fullscreen'],
  ['unordered', 'ordered', 'outdent', 'indent'],

  ['undo', 'redo'],
  ['viewsource'],
];

const toolbar = [
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
    },
    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana'],
    },
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],

  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'font_color'],
  ['insert_img'],
  ['hr', 'link'],
  ['fullscreen'],
  ['unordered', 'ordered', 'outdent', 'indent'],

  ['undo', 'redo'],
  ['viewsource'],
];

const fonts = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana',
};

const startVoiceRecognition_subject = () => {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ko-KR'; // Set to Korean, change to 'en-US' or other languages if needed
  recognition.interimResults = true; // Display interim results (sentences as you speak)
  recognition.continuous = true; // Continue listening until manually stopped

  recognition.onstart = () => {
    listening.value = true;
  };

  recognition.onend = () => {
    listening.value = false;
  };

  recognition.onresult = event => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + ' ';
    }
    formData.value.subject = transcript.trim(); // Append sentences and trim any extra spaces
  };

  recognition.onerror = event => {
    console.error('음성 인식 오류:', event.error);
  };

  recognition.start();
};

const stopVoiceRecognition_subject = () => {
  if (recognition) {
    recognition.stop();
  }
};

const startRecording = () => {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('이 브라우저에서는 음성 인식이 지원되지 않습니다.');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true; // Keep listening
  recognition.interimResults = false; // Only final results

  recognition.onresult = event => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ')
      .trim();
    // formData.value.contents += transcript + '\n'; // Add transcript with a new line
    formData.value.contents += transcript; // Add transcript with a new line
  };

  recognition.onerror = event => {
    console.error('음성 인식 오류', event.error);
  };

  recognition.onend = () => {
    console.log('음성 인식 서비스 연결 끊김');
  };

  recognition.start();
};
const stopRecording = () => {
  if (recognition) {
    recognition.stop();
  }
};
// ***** Voice입력 처리부분 끝 *****************************//

// *** HTML Editor 부분 **************
const definitions = ref({
  insert_img: {
    tip: '사진 첨부',
    label: '사진넣기',
    icon: 'photo',
    handler: insertImg,
  },
  voice_start: {
    label: '음성입력', // 마이크 아이콘
    icon: 'mic', // 원하는 아이콘 이름 (예: 'mic' or custom)
    handler: startRecording, // 클릭 시 호출될 함수
  },
  voice_stop: {
    label: '종료', // 스톱 아이콘
    icon: 'stop', // 원하는 아이콘 이름 (예: 'stop' or custom)
    handler: stopRecording, // 클릭 시 호출될 함수
  },
});

const tabValue = ref('download');
const splitterModel = ref(10);
const splitterModelXs = ref(20);
const maxFileSize = 5 * 1024 * 1024; // 5MB
const uploaderRef = ref(null);
const selectedFiles = ref([]);
const selectedFullFiles = ref([]);
const factoryFiles = async files => {
  try {
    const uploadPromises = files.map(async file => {
      await uploadFile(file, progressEvent => {
        // Update file.__progressLabel
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        file.__progressLabel = `${progress}%`;
      });
      return { url: '' }; // Update or return the URL as necessary
    });
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error in factoryFiles:', error);
  }
};

const uploadFile = async (file, progressCallback) => {
  try {
    const param = new FormData();
    param.append('file', file);
    param.append('lineCd', '7011101');
    param.append('stdDay', commUtil.unFormatDate(formData.value.stdDay));
    param.append('salesCd', formData.value.salesCd);
    param.append('seq', formData.value.seq);

    const res = await api.post('/api/mkt/mkt4010_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressCallback, // Pass the progress callback
    });
    // Handle the response as needed
    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);

    uploadFileList().then(() => {});
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const rowDataFile = ref([]);
const uploadFileList = async () => {
  if (uploaderRef.value) {
    uploaderRef.value.reset(); // Clear all files from the uploader
  }
  try {
    const param = new FormData();
    param.append('lineCd', '7011101');
    param.append('stdDay', commUtil.unFormatDate(formData.value.stdDay));
    param.append('salesCd', formData.value.salesCd);
    param.append('seq', formData.value.seq);

    const response = await api.post('/api/mkt/mkt4010_fileList', param, {});
    rowDataFile.value = response.data;
    // console.log('response : ', JSON.stringify(rowDataFile.value));
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const handleFileDownload = data => {
  // 파일 다운로드 요청
  api({
    url: `/api/mkt/mkt4010_fileDownload?fileNameFull=${data.fileNameFull}`,
    method: 'GET',
    responseType: 'blob', // 파일 다운로드를 위해 blob 응답 형식 설정
  })
    .then(response => {
      // 다운로드한 파일을 처리하는 코드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data.fileName); // 다운로드할 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      data.isDownloaded = '1';
    })
    .catch(error => {
      console.error('Download failed:', error);
    });
};

const allUnSelectedFiles = async () => {
  selectedFiles.value = [];
  selectedFullFiles.value = [];
};
const allDeleteSelectedFiles = async () => {
  selectedFiles.value = rowDataFile.value.map(file => file.fileName);
  selectedFullFiles.value = rowDataFile.value.map(file => file.fileNameFull);
};

const deleteSelectedFiles = async () => {
  // console.log('delete file : ', JSON.stringify(selectedFullFiles.value));
  try {
    const res = await api.post('/api/mkt/mkt4010_fileDelete', selectedFullFiles.value);
    // console.log('Delete response:', response.data);
    // Handle the response (e.g., show a success message, update the file list)
    rowDataFile.value = rowDataFile.value.filter(file => !selectedFiles.value.includes(file.fileName));
    selectedFiles.value = []; // Clear the selected files
    selectedFullFiles.value = []; // Clear the selected files

    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.error('Error deleting files:', error);
  }
};

const deleteSelectedFilesAll = async resFileKey => {
  console.log('delete file : ', resFileKey);
  const param = new FormData();
  param.append('fileKey', resFileKey);

  try {
    const res = await api.post('/api/mkt/mkt4010_fileDeleteAll', param);
    // console.log('Delete response:', response.data);
    // Handle the response (e.g., show a success message, update the file list)
    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.error('Error deleting files:', error);
  }
};

const deleteLineFilesAll = async resFileKey => {
  // console.log('delete file1111 : ', resFileKey);
  const param = new FormData();
  param.append('lineCd', '7011101');
  param.append('fileKey', resFileKey);

  try {
    const res = await api.post('/api/mkt/mkt4011_fileDeleteAll', param);
    // console.log('Delete response:', response.data);
    // Handle the response (e.g., show a success message, update the file list)
    let saveStatus = {};
    saveStatus.rtn = res.data.rtn;
    saveStatus.rtnMsg = res.data.rtnMsg;
    notifySave.notifyView(saveStatus);
  } catch (error) {
    console.error('Error deleting files:', error);
  }
};

// Function to toggle the selection of a file
const toggleSelection = data => {
  const isChecked = selectedFiles.value.some(file => file === data.fileName);

  // console.log('check : ', isChecked);

  if (isChecked) {
    selectedFullFiles.value.push(data.fileNameFull);
  } else {
    selectedFullFiles.value = selectedFullFiles.value.filter(file => file !== data.fileNameFull);
  }
  // console.log('selectedFiles : ', JSON.stringify(selectedFiles.value));
  // console.log('selectedFullFiles : ', JSON.stringify(selectedFullFiles.value));
};

//*** 이미지 삽입 ********
function insertImg() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.png, .jpg, .jpeg';

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 파일 크기를 줄이기 위해 이미지 품질을 설정합니다(0~1 사이, 1은 전체 품질)
        const quality = 0.3; // 0.5 낮은 퀄릴티, 0.8 높은 퀄리티

        // Use JPEG format for quality reduction; PNG does not support quality settings in toDataURL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Insert the image with reduced file size
        formData.value.contents += `<div><img style="max-width: 100%;" src="${dataUrl}" /></div>`;
      };
    };
    reader.readAsDataURL(file);
  };
  input.click();
} //*** 이미지 삽입 끝 ********

//*** 폰트 컬러 지정 ********
const textColor = ref('#000');
const editColor = ref(false);
const qEditorContents = ref(null);
const colorPickerStyle = ref({ top: '0px', left: '0px' });

function applyColor() {
  const selection = window.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (selection.isCollapsed) {
      // If there is no text selected, create a span with the chosen color
      const span = document.createElement('span');
      span.style.color = textColor.value;
      span.appendChild(document.createTextNode('\u200B')); // Zero-width space to allow typing

      range.insertNode(span);
      range.setStart(span.firstChild, 1); // Move the cursor inside the span
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // If text is selected, use execCommand to apply the color
      document.execCommand('foreColor', false, textColor.value);
    }
  }

  editColor.value = false;
}
function fontColor(event) {
  editColor.value = true;
  // console.log('event : ', JSON.stringify(event));
  const { clientX, clientY } = event;
  colorPickerStyle.value = {
    top: `${clientY - 120}px`, // Position below the button
    left: `${clientY + 20}px`, // Align horizontally with the button
    position: 'absolute',
  };
}
//*** 폰트 컬러 지정 끝 ********
</script>

<style lang="sass" scoped>
.editor-container
  height: 100vh /* Adjust to your desired height */
  overflow: hidden /* Prevent content overflow */
  display: flex
  flex-direction: column
</style>
